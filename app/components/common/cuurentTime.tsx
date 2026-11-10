import dayjs from "dayjs";
import { useEffect, useState } from "react";

const CurrentTime = () => {

  // 時間を取得
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  return(
    <>
      <p>{dayjs(time).format('HH:mm')}</p>
    </>
  )
}

export default CurrentTime;
