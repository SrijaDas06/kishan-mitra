// document.addEventListener('DOMContentLoaded', () => {
//     const dropdowns = document.querySelectorAll('.dropdown');
//     dropdowns.forEach(dropdown => {
//         dropdown.addEventListener('mouseover', () => {
//             dropdown.querySelector('.dropdown-content').style.display = 'block';
//         });
//         dropdown.addEventListener('mouseout', () => {
//             dropdown.querySelector('.dropdown-content').style.display = 'none';
//         });
//     });
// });




gsap.to("#main",{
    backgroundColor : "#000",
    scrollTrigger : {
        trigger : "#main",
        scroller : "body",
        markers : true,
        start : "top -95vh",
        end : "top -100vh",
        scrub : 2
    }
})

// script.js
document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const popup = document.getElementById("popup");
    const closeBtn = document.querySelector(".close");
    const form = document.getElementById("registerForm");

    registerBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        // Here you can handle the form data, e.g., send it to a server
        console.log(`Email: ${email}, Password: ${password}`);
        popup.style.display = "none";
    });
});
