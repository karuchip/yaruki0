import { useEffect, useState } from "react";

const RealTimeClock = () => {

  const [time, setTime] = useState(new Date());

  useEffect(() => {

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return(
    <>
      <div>
        <p>{time.toLocaleTimeString()}</p>
      </div>
    </>
  )
}
export default RealTimeClock;
