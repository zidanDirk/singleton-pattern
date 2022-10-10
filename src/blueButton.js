import counterInstance  from "./counter";
const counter = counterInstance.counter

const button = document.getElementById("blue");
button.addEventListener("click", () => {
  console.log("Counter total: ", counter.increment());
});
