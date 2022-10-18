import React, { Fragment, useState, useContext } from "react";
import { renderHTML, scrollToElem } from "./utilities";
import { Store } from "./AppContext";
import "./styles.css";
import data from "./data.json";

/** Used to compare against user's chosen answers */
const PastQuestions = data.results.length;
const FutureQuestions = data.FutureResult.length;

export default function Backup() {
  const [chosenAnswers, setChosenAnswers] = useState([]);
  const [pastAnswers, setPastAnswers] = useState(data.results.map(() => ""));
  const [futureAnswers, setFutureAnswers] = useState(
    data.FutureResult.map(() => "")
  );

  console.log({ pastAnswers, futureAnswers });

  function renderPastQuestions() {
    return data.results.map((result, index) => (
      <PastQuestion
        key={index}
        result={result}
        index={index}
        onSubmit={(answer) =>
          setPastAnswers((prev) => {
            prev[index] = answer;
            return [...prev];
          })
        }
      />
    ));
  }
  function renderFutureQuestions() {
    return data.FutureResult.map((result, index) => (
      <FutureQuestion
        key={index}
        result={result}
        index={index}
        onSubmit={(answer) =>
          setFutureAnswers((prev) => {
            prev[index] = answer;
            return [...prev];
          })
        }
      />
    ));
  }

  return (
    <div className="background">
      <Store.Provider value={{ chosenAnswers, setChosenAnswers }}>
        <Start />
        <PastSession />
        {renderPastQuestions()}
        <PastSessionResult pastAnswers={pastAnswers} />
        <FutureSession />
        {renderFutureQuestions()}
        <FutureSessionResult futureAnswers={futureAnswers} />
        <Finish />
      </Store.Provider>
    </div>
  );
}

/**
 * Renders questions, answers and buttons to progress.
 *
 * @param {{results: any, index: number, onSubmit: (answer: string) => any}} props
 */
export function PastQuestion({ result, index, onSubmit }) {
  const [data, setData] = useState(null);
  const [print, setPrint] = useState(false);
  function getData(val) {
    setData(val.target.value);
    setPrint(false);
    console.warn(val.target.value);
  }
  return (
    <>
      <section id={`question-${index}`} className="fullpage-center">
        <h2>
          {index + 1}.{renderHTML(result.question)}
        </h2>
        <div className="answer">
          {print ? <h1>{data}</h1> : null}
          Please answer with one or two words in English.
          <input className="form_input" type="text" onChange={getData} future="future" />
        </div>
        <section className="btn-group" style={{ display: "flex" }}>
          {index !== 0 && (
            <Button
              text="prev"
              func={() => scrollToElem(`question-${index - 1}`)}
            />
          )}
          {index !== PastQuestions - 1 && (
            <Button
              text="next"
              func={() => {
                setPrint(true);
                onSubmit(data);
                scrollToElem(`question-${index + 1}`)
              }
              }
            />
          )}
          {index === PastQuestions - 1 && (
            <Button
              text="finish"
              func={() => {
                setPrint(true);
                onSubmit(data);  
              scrollToElem("PastSessionResult")}
              }
            />
          )}
        </section>
      </section>
    </>
  );
}

export function FutureQuestion({ result, index, onSubmit }) {
  const [data, setData] = useState(null);
  const [print, setPrint] = useState(false);
  function getData(val) {
    setData(val.target.value);
    setPrint(false);
    console.warn(val.target.value);
  }
  return (
    <>
      <section id={`futurequestion-${index}`} className="fullpage-center">
        <h2>
          {index + 1}.{renderHTML(result.futurequestion)}
        </h2>
        <div className="answer">
          {print ? <h1>{data}</h1> : null}
          Please answer with one or two words in English.
          <input className="form_input" type="text" onChange={getData} future="future" />
        </div>
        <section className="btn-group" style={{ display: "flex" }}>
          {index !== 0 && (
            <Button
              text="prev"
              func={() => scrollToElem(`futurequestion-${index - 1}`)}
            />
          )}
          {index !== FutureQuestions - 1 && (
            <Button
              text="next"
              func={() => {
                setPrint(true);
                onSubmit(data);
                scrollToElem(`futurequestion-${index + 1}`)
              }
              }
            />
          )}
          {index === FutureQuestions - 1 && (
            <Button 
            text="finish" 
            func={() => {
              setPrint(true);
              onSubmit(data);
              scrollToElem("finish")
            }
            }
            />
          )}
        </section>
      </section>
    </>
  );
}

/**
 * Combine correct and incorrect answers, sort them in alphabetical order
 * then return radio buttons.
 *
 * @param {{result:{}, parentIndex:number}} props
 */
// export function Answers({ result, parentIndex }) {
//   const combinedAnswers = [...result.incorrect_answers, result.correct_answer];
//   combinedAnswers.sort(); // Sort to alphabetical order
//   return combinedAnswers.map((answer, index) => (
//     <Answer
//       key={index}
//       answer={answer}
//       index={index}
//       parentIndex={parentIndex}
//     />
//   ));
// }

// function Answer({ answer, index, parentIndex }) {
//   const { chosenAnswers, setChosenAnswers } = useAppContext();
//   return (
//     <Fragment>
//       <input
//         type="radio"
//         name={`question-${parentIndex}`}
//         onChange={element =>
//           setChosenAnswers(
//             handleChosenAnswer(element, parentIndex, chosenAnswers)
//           )
//         }
//         value={index}
//       />
//       {renderHTML(answer)}
//       <br />
//     </Fragment>
//   );
// }

/**
 * Saves me from writing type button over and over.
 *
 * @param {{text: string, func: () => {}}} props
 */
function Button({ text, func }) {
  return (
    <button type="button" onClick={func}>
      {text}
    </button>
  );
}

function Start() {
  return (
    <section className="fullpage-center" id="start">
      <h1>Future DDW 2022</h1>
      <h2>
        We are going to ask questions about your past and future.
        <br></br>Your answer will be appear in the screen as an image generated
        by ai.
      </h2>
      <Button text="Let's go!" func={() => scrollToElem("PastSession")} />
    </section>
  );
}

function PastSession() {
  return (
    <section className="fullpage-center" id="PastSession">
      <h1>First, think about Your past</h1>
      <h2>
        Think back to when you were younger.
        <br></br>What ideas or visions did you have of what the future might be
        like,
        <br></br>that still affect you today—even if they never happened?
        These could be ideas, images, concepts, memories, that are 'past' but
        still have a hold on you—still motivate or worry you, still affect the
        way you think about or approach the world. They might be about a
        specific area of life (technology, everyday living, environment, travel,
        fashion, politics) or more broadly.
      </h2>
      <Button text="Ok" func={() => scrollToElem("question-0")} />
    </section>
  );
}

function PastSessionResult({ pastAnswers }) {
  const [imageUrl, setImageUrl] = useState("");
  const promptText =
    pastAnswers.join() + "in past";
  const handleClick = () => {
    fetch("http://localhost:4000/api/dreamstudio-image", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
        width: 200,
        height: 200,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(`http://localhost:4000/${data.serveUrl}`);
      });
  }

  return (
    <section className="fullpage-center" id="PastSessionResult">
      <div className="Pastanswer">
        <h1>
          This is your past image
          based on your anwser..
          <div className="past-image-result"></div>
          {promptText}
          <br></br>
          <button onClick={handleClick}>Show image</button>
          <br></br>
          <img src={imageUrl} crossOrigin="anonymous" />
        </h1>
      </div>
    </section>
  );
}

function FutureSession() {
  return (
    <section className="fullpage-center" id="FutureSession">
      <h1>Second, think about Your future</h1>
      <h2>
        Now think about the present.
        <br></br>What visions of a possible future motivate or affect you right
        now?
        <br></br>
        These could be ideas, images, concepts, hopes, that are 'still to
        happen' but nevertheless have a hold on you—inspire or motivate you (or
        worry you), affecting the way you think about or approach the world.
      </h2>
      <Button text="Ok" func={() => scrollToElem("futurequestion-0")} />
    </section>
  );
}

function FutureSessionResult({ futureAnswers }) {
  const [imageUrl, setImageUrl] = useState("");
  const promptText =
  futureAnswers.join(" ") +  "in future";
  const handleClick = () => {
    fetch("http://localhost:4000/api/dreamstudio-image", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptText,
        width: 200,
        height: 200,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(`http://localhost:4000/${data.serveUrl}`);
      });
  }

  return (
    <section className="fullpage-center" id="FuturetSessionResult">
      <div className="future">
        <h1>
          This is your future image
          based on your anwser..
          <div className="future-image-result"></div>
          {promptText}
          <br></br>
          <button onClick={handleClick}>Show image</button>
          <br></br>
          <img id="image" src={imageUrl} crossOrigin="anonymous" />
        </h1>
      </div>
    </section>
  );
}

function Finish() {
  const { chosenAnswers } = useContext(Store);
  const textCompleted = (
    <Fragment>
      <h3>Thank you for submiting your answer.</h3>
      <Button text="start over" func={() => window.location.reload()} />
    </Fragment>
  );

  const textIncomplete = (
    <Fragment>
      <h4>Opps, looks like you haven't answered all the questions</h4>
      <p>Scroll up to see which questions you've missed out </p>
    </Fragment>
  );

  /** Questions answered out of sequence will cause array to have `undefineds`
   * this variable counts the length with those filtered out
   */
  // const answeredQuestions = chosenAnswers.filter(
  //   (ar) => ar !== undefined
  // ).length;

  // return (
  //   <section className="fullpage-center" id="finish">
  //     {answeredQuestions === PastQuestions ? textCompleted : textIncomplete}
  //   </section>
  // );
}
