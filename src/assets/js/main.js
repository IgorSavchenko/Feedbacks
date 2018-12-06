document.addEventListener("DOMContentLoaded", () => {

  document.querySelector(".burger").addEventListener("click", () => {
    event.target.classList.toggle("burger--active");
    document.querySelector(".navigation__menu").classList.toggle("navigation__menu--active");
  })

  document.querySelectorAll(".navigation__item").forEach( (item) => {
    item.addEventListener("click", () => {
      event.preventDefault();
      document.querySelectorAll(".navigation__item").forEach( (item) => {
        item.classList.remove("navigation__item--active");
      })
      item.classList.add("navigation__item--active");
    })
  })


})
