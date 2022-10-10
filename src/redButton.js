import counterInstance  from "./counter";
const counter = counterInstance.counter

const button = document.getElementById("red");
button.addEventListener("click", () => {
  console.log("Counter total: ", counter.increment());
});
