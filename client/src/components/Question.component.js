import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Question(props) {
  let history = useHistory();

  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = (res.time.split(":")[1]) ? res.time.split(":")[1] : 0;
  const length = res.results.length;
  const [ques, setques] = useState(0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState({});

  const submithandler = () => {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let pin = localStorage.getItem("pin");

    let score = 0;
    for (let i = 0; i < length; i++) {
      if (answers[i] == res.results[i].correct_answer) {
        score += 1;
      }
    }
    score = (score / length) * 100;
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "http://localhost:5000/api/test/submittest",
        {
          pin,
          email,
          name,
          score,
        },
        options
      )
      .then((res) => {
        console.log(res);
        history.push("/");
      })
      .catch((err) => console.log(err));
    console.log(score);
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      res.results[i].question = res.results[i].question.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].correct_answer = res.results[i].correct_answer.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].incorrect_answers = res.results[
        i
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, [res.results, length]);

  useEffect(() => {
    setquestion(res.results[ques].question);
    setoptions(shuffleArray([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]));
  }, [ques, res.results]);

  const entities = {
    "&#039;": "'",
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&#34;": "'",
    "&#034;": '"',
    "&#60;": "<",
    "&#060;": "<",
    "&#62;": ">",
    "&#062;": ">",
    "&amp;": "&",
    "&#38;": "&",
    "&#038;": "&",
  };

  const changeclass = (e) => {
    const domele = e.target.closest("#options");
    if (domele) {
      let ans = "";
      domele.childNodes.forEach(child => {
        child.className = styles.container;
      });
      const selectedOption = e.target.closest("div");
      if (selectedOption) {
        selectedOption.className = styles.containeractive;
        ans = selectedOption.childNodes[0].value;
      }
      setanswers({ ...answers, [ques]: ans });
    }
  };

  useEffect(() => {
    const selectedAnswer = answers[ques];
    const optionsContainer = document.getElementById('options');
    if (optionsContainer) {
      optionsContainer.childNodes.forEach(child => {
        const input = child.querySelector('input');
        if (input && input.value === selectedAnswer) {
          child.className = styles.containeractive;
        } else {
          child.className = styles.container;
        }
      });
    }
  }, [ques, answers]);

  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} submithandler={submithandler} />
      <div className={styles.qcontainer}>
        {ques + 1}. {question}
      </div>
      <div id="options">
        {options.map((option, index) => (
          <div key={index} className={styles.container} onClick={changeclass}>
            <input
              className={styles.radios}
              type="radio"
              value={option}
              name="options"
              id={index.toString()}
              checked={answers[ques] === option}
              readOnly
            />
            <label htmlFor={index.toString()}>
              {String.fromCharCode("A".charCodeAt(0) + index)}. {option}
            </label>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          onClick={() => {
            if (ques > 0) {
              setques(ques - 1);
            }
          }}
          className={styles.buttons1}
        >
          &#8249;
        </a>
        <a
          onClick={() => {
            if (ques < length - 1) {
              setques(ques + 1);
            }
          }}
          className={styles.buttons2}
        >
          &#8250;
        </a>
      </div>
    </Fragment>
  );
}

export default Question;
