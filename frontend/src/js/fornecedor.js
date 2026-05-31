document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const btn = document.getElementById("open-modal");
    const close_modal = document.getElementById("close");

    btn.addEventListener("click", () => {
        modal.classList.add("flex");
        modal.classList.remove("hidden");
    })

    close_modal.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    })


    window.addEventListener("click", (e) => {
        if(e.target == modal){
            modal.classList.add("hidden");
        }
    })
})