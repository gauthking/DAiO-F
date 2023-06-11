import csv

with open("./UserData1.csv", 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["walletAddress"])
        