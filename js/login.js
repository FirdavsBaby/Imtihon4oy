let password = document.querySelector("#password");
let email = document.querySelector("#email");
let login = document.querySelector("#submit");

async function getData(email, password) {
  let respone = await fetch("https://reqres.in/api/login", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await respone.json();
  if (data.token) {
    localStorage.setItem("token", JSON.stringify(data.token));
    window.location.replace("./home.html")
  } else {
    alert(data.error);
  }
}

login.addEventListener("click", (e) => {
    e.preventDefault()
    let passwordV = password.value;
    let emailV = email.value;
    getData(emailV, passwordV)
});


