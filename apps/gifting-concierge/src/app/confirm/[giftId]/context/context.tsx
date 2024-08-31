'use client'
import { createContext, useState } from "react";

export const Context = createContext({
    secondStep: false,
    thirdStep: false,
    verifySeconsStep: () => {},
    verifyThirdStep: () => {}
})

export const Provider = ({children}:{ children: React.ReactNode }) => {

    const [secondStep, setSecondStep] = useState<boolean>(false)
    const [thirdStep, setThirdStep] = useState<boolean>(false)

    const verifySeconsStep = () => {
        setSecondStep(true)
    }

    const verifyThirdStep = () => {
        setThirdStep(true)
    }

    return (
        <Context.Provider value={{
            secondStep,
            thirdStep,
            verifySeconsStep,
            verifyThirdStep
        }}>
            {children}
        </Context.Provider>
    )
}
