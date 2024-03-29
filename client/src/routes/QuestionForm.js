import data from "../data.json";
import StartSection from "../components/StartSection";
import React, { useState } from "react";
import { PastQuestionIntroduction } from "../components/Past/PastQuestionIntroduction";
import { Question } from "../components/shared/Question";
import { PastQuestionResults } from "../components/Past/PastQuestionResults";
import { FutureQuestionIntroduction } from "../components/Future/FutureQuestionIntroduction";
import { FutureSessionResults } from "../components/Future/FutureQuestionResults";
import { Finish } from "../components/Finished";
import Introduction from "../components/Introduction";
import Background from "../components/shared/Background";
import Footer from "../components/Footer";

export const QuestionForm = () => {
  const pastResultMap = data.pastResults;
  const futureResultMap = data.futureResults;

  const pastQuestionCount = pastResultMap.length;
  const futureQuestionCount = futureResultMap.length;

  const [pastAnswers, setPastAnswers] = useState(pastResultMap.map(() => ""));
  const [futureAnswers, setFutureAnswers] = useState(
    futureResultMap.map(() => "")
  );

  const [show, setShow] = useState(false);
  const [pastshow, setPastshow] = useState(false);
  const [futureshow, setFutureshow] = useState(false);

  function onContinue() {
    setShow(true)
  }
  function startquestion(){
    setPastshow(true)
  }
  function startfuturequestion(){
    setFutureshow(true)
  }

  return (
    <>
      <Background />
      <StartSection onContinue={onContinue} />
      <Introduction show={show} startquestion={startquestion} />
      <PastQuestionIntroduction pastshow={pastshow} nextAnchor={"pastquestion-0"} />
      {pastResultMap.map((result, index) => (
        <Question
          questionPrefix={"pastquestion"}
          resultElementId={"pastSessionResults"}
          key={index}
          maxQuestions={pastQuestionCount}
          result={result}
          index={index}
          onSubmit={(answer) =>
            setPastAnswers((prev) => {
              prev[index] = answer;
              return [...prev];
            })
          }
        />
      ))}
      <PastQuestionResults
        pastAnswers={pastAnswers}
        anchor={"pastSessionResults"}
        nextAnchor={"futureSessionIntroduction"}
        startfuturequestion={startfuturequestion}
      />

      <FutureQuestionIntroduction futureshow={futureshow} />
      {futureResultMap.map((result, index) => (
        <Question
          questionPrefix={"futurequestion"}
          resultElementId={"futureSessionResults"}
          key={index}
          maxQuestions={futureQuestionCount}
          result={result}
          index={index}
          onSubmit={(answer) =>
            setFutureAnswers((prev) => {
              prev[index] = answer;
              return [...prev];
            })
          }
        />
      ))}
      <FutureSessionResults
        anchor={"futureSessionResults"}
        futureAnswers={futureAnswers}
      />
      <Finish
        anchor={"finshed"}
      />
      <Footer className="footer-app" />
    </>
  );
};
