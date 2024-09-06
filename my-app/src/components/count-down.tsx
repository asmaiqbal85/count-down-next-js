"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import internal from "stream";

export default function Countdown (){
    const [duration, setDuration] = useState<number | string>("");
    const [timeLeft, settimeLeft] = useState<number>(0);
    const [isActive, setisActive] = useState<boolean>(false);
    const [isPaused, setisPaused] = useState<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleSetDuration = (): void => {
        if(typeof duration === "number" && duration >0){
            settimeLeft(duration);
            setisActive(false);
            setisPaused(false);
            if(timerRef.current){
                clearInterval(timerRef.current);
            }
        }
    };
    const handleStart = (): void => {
        if(timeLeft >0){
            setisActive(true);
            setisPaused(false);
        }
    };
    const handlePause = (): void => {
        if(isActive){
            setisPaused(true);
            setisActive(false);
            if(timerRef.current){
                clearInterval(timerRef.current);
            }    
        }
    };

    const handleReset = (): void => {
        setisActive(false);
        setisPaused(false);
        settimeLeft(typeof duration === "number"? duration : 0);
        if(timerRef.current){
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        if(isActive && !isPaused){
            timerRef.current = setInterval(() => {
             settimeLeft ((prevTime) => {
                if(prevTime <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prevTime -1;
             });   
            },1000);
        }
        return () => {
            if(timerRef.current){
                clearInterval(timerRef.current)
            }
        };
    }, [isActive, isPaused]);
    const formatTime = (time: number): string => {
        const minutes = Math.floor(time/60);
        const seconds =time % 60;
        return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`
    };
    const handleDurationChange = (e:ChangeEvent<HTMLInputElement>):void => {
        setDuration(Number(e.target.value) || "");
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-purple-950">
          <h1 className="text-7xl font-bold mb-4 text-white">Countdown Timer</h1>
          <Input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="Enter duration in seconds"
            className="w-64 mb-4 bg-white"
          />
          <div className="flex mb-4">
            <Button onClick={handleSetDuration} className="mr-2 bg-white">
              Set Duration
            </Button>
            <Button onClick={handleStart} className="mr-2 bg-white">
              Start
            </Button>
            <Button onClick={handlePause} className="mr-2 bg-white">
              Pause
            </Button>
            <Button onClick={handleReset} className="mr-2 bg-white">Reset</Button>
          </div>
          <div className="text-4xl font-bold text-white">
            {formatTime(timeLeft)}
          </div>
        </div>
      );
    }

    

