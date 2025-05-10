import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const danishNumbers = {
  0: "nul", 1: "en", 2: "to", 3: "tre", 4: "fire", 5: "fem", 6: "seks",
  7: "syv", 8: "otte", 9: "ni", 10: "ti", 11: "elleve", 12: "tolv",
  13: "tretten", 14: "fjorten", 15: "femten", 16: "seksten", 17: "sytten",
  18: "atten", 19: "nitten", 20: "tyve", 30: "tredive", 40: "fyrre",
  50: "halvtreds", 60: "tres", 70: "halvfjerds", 80: "firs", 90: "halvfems",
  100: "hundrede",
};

function getDanishNumber(n) {
  if (danishNumbers[n]) return danishNumbers[n];
  const ones = n % 10;
  const tens = Math.floor(n / 10) * 10;
  const onesStr = ones === 1 ? "en" : danishNumbers[ones];
  return `${onesStr}og${danishNumbers[tens]}`;
}

export default function App() {
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(100);
  const [number, setNumber] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [completedNumbers, setCompletedNumbers] = useState([]);

  useEffect(() => {
    resetSession();
  }, [rangeStart, rangeEnd]);

  const resetSession = () => {
    setCompletedNumbers([]);
    setHistory([]);
    generateNewNumber([]);
  };

  const generateNewNumber = (doneList = completedNumbers) => {
    const min = Math.min(rangeStart, rangeEnd);
    const max = Math.max(rangeStart, rangeEnd);
    const pool = [];

    for (let i = min; i <= max; i++) {
      if (!doneList.includes(i)) pool.push(i);
    }

    if (pool.length === 0) {
      setNumber(null);
    } else {
      const newNum = pool[Math.floor(Math.random() * pool.length)];
      setNumber(newNum);
    }
  };

  const handleSubmit = () => {
    if (number === null) return;

    const correct = getDanishNumber(number);
    const isCorrect = input.trim().toLowerCase() === correct;

    setHistory([{ number, user: input, correct, isCorrect }, ...history]);

    if (isCorrect) {
      const newCompleted = [...completedNumbers, number];
      setCompletedNumbers(newCompleted);
      generateNewNumber(newCompleted);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "da-DK";
    speechSynthesis.speak(utterance);
  };

  return (
      <div className="container my-4">
        <h1 className="text-center mb-4">🇩🇰 Danish Number Trainer</h1>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Start</label>
            <input
                type="number"
                className="form-control"
                value={rangeStart}
                onChange={(e) => setRangeStart(Number(e.target.value))}
            />
          </div>
          <div className="col">
            <label className="form-label">End</label>
            <input
                type="number"
                className="form-control"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(Number(e.target.value))}
            />
          </div>
        </div>

        {number !== null ? (
            <>
              <h2 className="text-center mb-3">
                Translate: <strong>{number}</strong>
              </h2>

              <input
                  type="text"
                  className="form-control mb-3"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Danish word"
              />

              <button className="btn btn-primary w-100 mb-4" onClick={handleSubmit}>
                Submit
              </button>
            </>
        ) : (
            <div className="alert alert-success text-center">🎉 All numbers completed!</div>
        )}

        <h3>History</h3>
        <ul className="list-group">
          {history.map((entry, idx) => (
              <li
                  key={idx}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                      entry.isCorrect ? "list-group-item-success" : "list-group-item-danger"
                  }`}
              >
            <span>
              {entry.number} → You: "{entry.user}" (
              {entry.isCorrect ? "Correct" : `Correct: ${entry.correct}`})
            </span>
                <button
                    onClick={() => speak(entry.correct)}
                    className="btn btn-outline-secondary btn-sm"
                    title="Hear pronunciation"
                >
                  🔊
                </button>
              </li>
          ))}
        </ul>
      </div>
  );
}
