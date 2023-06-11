import React from 'react';

const QuestionForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-question">
          <label className="form-label">Question 1:</label>
          <input type="text" name="question1" className="form-input" />
        </div>
        <div className="form-question">
          <label className="form-label">Question 2:</label>
          <input type="text" name="question2" className="form-input" />
        </div>
        <div className="form-question">
          <label className="form-label">Question 3:</label>
          <input type="text" name="question3" className="form-input" />
        </div>
        {/* Add more questions here */}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default QuestionForm;
