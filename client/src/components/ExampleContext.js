import {createContext} from "react";

const ExampleContext = createContext()

export const ExampleProvider = (props) => {
    return (
        <ExampleContext.Provider value={props.val}>
            {props.children}
        </ExampleContext.Provider>
    )
}

export default ExampleContext