import styles from "./App.module.css";

import { createSignal } from "solid-js";

import { sendSignedTypedData } from "./typed_data.js";

function App() {
  const [name, setName] = createSignal("food");
  const [amount, setAmount] = createSignal(15);

  return (
    <div class={styles.App}>
      <div class={styles.Inputs}>
      <input
        class={styles.Input}
        onInput={(e) => {
          setName(e.target.value);
        }}
        placeholder="Input name"
      ></input>
      <input
        class={styles.Input}
        onInput={(e) => {
          setAmount(e.target.value);
        }}
        placeholder="Input amount"
      ></input>
      </div>
      
      <button onClick={async() => await sendSignedTypedData(name(), amount())}>Add a spending!</button>
    </div>
  );
}

export default App;
