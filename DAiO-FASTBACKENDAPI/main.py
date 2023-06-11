from web3 import Web3
from web3.middleware import geth_poa_middleware
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import csv
import requests
import json
import time
import asyncio

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class QnaResponse(BaseModel):
    qnId:int
    question: str
    res: str
  
class LoginParamTypes(BaseModel):
    walletAddress: str | None
    response: QnaResponse
    AIPkey:str
    AIPvKey:str


w3 = Web3(Web3.HTTPProvider("https://multi-few-county.matic-testnet.discover.quiknode.pro/c1360f6aebb20ed3d5e6e63cbd0923e02078453d/"))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)
contr_address = "0x6684FFF5Acd83C6AF445950EeE88D3C1A668Ed59"
abi_json = open('abi.json')
contr_abi = json.load(abi_json)['abi']

ngrok_endpoint = "https://bc65-34-125-207-35.ngrok-free.app/getsentiment"


contract = w3.eth.contract(address=contr_address, abi=contr_abi)
proposals = contract.functions._proposalId().call()


async def run_proposal_status_check():
    while True:
        await check_proposal_status()
        await asyncio.sleep(5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(run_proposal_status_check())

# @app.on_event('startup')
# async def startup_event():
#   await check_proposal_status()


@app.post("/getaikeys/{walletAddress}")
async def get_keys(walletAddress:str):
  with open("./AItoUserData1.csv", 'r') as aicsvfile:
    reader = csv.reader(aicsvfile)
    header = next(reader)
    rows = list(reader)
    for i in rows:
      if i[0]==walletAddress:
        return {"AIPKey":i[2], "AIPubKey":i[1]}
  

@app.post("/vote")
async def get_login_params(loginparams: LoginParamTypes):
    file_path = './UserData1.csv'
    rows = []
    header = []
    wallets = []
    with open(file_path, 'r') as csvfile:
      reader = csv.reader(csvfile)
      header = next(reader)
      rows = list(reader)
      print(rows)
    proposalID = "Proposal-"+str(loginparams.response.qnId)
    if(rows==[]):
      wallets=[]
    else:
      wallets = [rows[i][0] for i in range(0,len(rows))]
      
    #if a proposalId being sent to the server is not present in our records. THIS COULD BE USEFUL FOR THE NEW PROPOSALS GETTING ADDED.
    if (proposalID not in header):
      newProposal = proposalID
      header.append(newProposal)
      for i in range(1, len(rows)):
        rows[i].append('')

      with open(file_path,'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(rows)
  
    if(loginparams.walletAddress not in wallets):
      wallets.append(loginparams.walletAddress)
      with open(file_path, 'r') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)
        rows = list(reader)
      newRow = []
      newRow.append(loginparams.walletAddress)
      for i in range(len(header)-1):
        newRow.append('')
      rows.append(newRow)
      with open(file_path,'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(rows)

      with open("./AItoUserData1.csv", 'a', newline='') as aicsvfile:
        writer = csv.writer(aicsvfile)
        writer.writerow([loginparams.walletAddress, loginparams.AIPkey, loginparams.AIPvKey])

      
    if(loginparams.walletAddress in wallets):
      index = wallets.index(loginparams.walletAddress)
      userRow = rows[index]
      id = "Proposal-"+str(loginparams.response.qnId)
      headerId = header.index(id)
      # this should get the sentiment value for the user's response to that proposal ID
      sentiment_api_call = requests.post(ngrok_endpoint, json={"proposal":loginparams.response.question, "res":loginparams.response.res})
      print(sentiment_api_call)
      result_sentiment = sentiment_api_call.json()
      print(result_sentiment)
      userRow[headerId] = result_sentiment['sentiment']  # sentiment bert model
      # Write the modified CSV file
      
      with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(header)
        writer.writerows(rows)
      


    
    return {"Posted":header}
          


async def ai_automated_vote(avgPersona, wallet, proposalTitle, proposalId):
  with open("./AItoUserData1.csv", 'r') as csvfile:
    reader = csv.reader(csvfile)
    header = next(reader)
    rows = list(reader)
    print(rows)
    wallets = [i[0] for i in rows if i]
    walletIndex = 0
    for i in range(len(wallets)):
      if(wallets[i]==wallet):
        walletIndex = i
    print(rows)
    pvKey = rows[walletIndex][2]
    pubKey = rows[walletIndex][1]

    assumed_proposalY = "The proposal is" + " " + proposalTitle + "and the user's response is Yes"
    assumed_proposalN = "The proposal is" + " " + proposalTitle + "and the user's response is No"

    print(assumed_proposalY)
    print(assumed_proposalN)

    print(proposalTitle)

    assumed_sentimentYCall = requests.post(ngrok_endpoint, json={"proposal":proposalTitle, "res":"Yes"})
    assumed_sentimentNCall = requests.post(ngrok_endpoint, json={"proposal":proposalTitle, "res":"No"})

    assumed_sentimentYJson = assumed_sentimentYCall.json()
    assumed_sentimenNJson = assumed_sentimentNCall.json()

    assumed_sentimentY =int(assumed_sentimentYJson['sentiment'])
    assumed_sentimentN =int(assumed_sentimenNJson['sentiment'])

    print(assumed_sentimentN)
    print(assumed_sentimentY)


    final_vote = 0

    if(abs(assumed_sentimentY-avgPersona) < abs(assumed_sentimentN-avgPersona)):
      final_vote = 1
    else:
      final_vote = 0

    print(abs(assumed_sentimentY-avgPersona))
    print(abs(assumed_sentimentN-avgPersona))
    newid = proposalId-5
    print(proposalId,newid)
    voting_func = contract.functions.voteOnproposalAI(newid, final_vote)
    gas = voting_func.estimate_gas({'from':pubKey})

    transac = voting_func.build_transaction({
        'gas':gas,
        'gasPrice':w3.to_wei('50', 'gwei'),
        'nonce':w3.eth.get_transaction_count(pubKey)
    })
    signed_tx = w3.eth.account.sign_transaction(transac, pvKey)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    print(f"AI ({pubKey}) Voted for proposal ID - {proposalId}")
    print("TX HASH - ", tx_hash)
    print(final_vote)

    # update the csv file
    with open('./UserData1.csv', 'r') as csvfile:
      reader = csv.reader(csvfile)
      headers = next(reader)
      print(headers)
      rows1 = list(reader)

      index_of_proposal = headers.index("Proposal-"+str(proposalId))
      index_of_wallet = 0
      for i in range(0,len(rows1)):
        if(rows1[i][0]==wallet):
          index_of_wallet = i
          break

      print(index_of_wallet, index_of_proposal)
      rows1[index_of_wallet][index_of_proposal] = avgPersona

      with open('./UserData1.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(rows1)


async def check_proposal_status():
  print("CHECK PROPOSAL STATUS RUNNING")
  proposal_count = contract.functions._proposalId().call()
  try:
    for i in range(proposal_count):
      proposal = contract.functions.proposals(i).call()
      # if that proposal's status is false meaning it is closed
      if(proposal[7]==False):
        id1 = proposal[0]+5
        id = "Proposal-"+str(id1)
        print(id)
        # checking in our user data for the users who has not voted for that particular proposal
        with open('./UserData1.csv','r') as csvfile:
          reader = csv.reader(csvfile)
          headers = next(reader)
          rows = list(reader)
          print(rows)
          fieldIndex = headers.index(id)
          for j in range(1,len(rows)):
            # if that user has not voted for that proposal
            if(rows[j][fieldIndex] == ""):
              # get his wallet address
              wallet = rows[j][0]
              print(wallet)
              avgPersona = 0
              sentiNum = 0
              # calculate average persona
              for k in rows[j]:
                if(k!="" and k!=rows[j][0]):
                  avgPersona+=float(k)
                  sentiNum+=1
              avgPersona = avgPersona/sentiNum
              # calling the function for the ai to vote
              await ai_automated_vote(avgPersona, wallet, proposal[1], id1)
  except Exception as e:
    print(e)
  
