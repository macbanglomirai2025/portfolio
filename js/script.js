
fetch("data/projects.json")
.then(res => res.json())
.then(data => {

const container = document.getElementById("project-container")

data.forEach(project => {

const card = document.createElement("div")

card.classList.add("project-card")

card.innerHTML = `

<img src="${project.image}" alt="project">

<h3>${project.name}</h3>

<p>${project.description}</p>

<div class="project-links">

<a href="${project.live}" target="_blank">Live</a>

<a href="${project.github}" target="_blank">GitHub</a>

</div>

`

container.appendChild(card)

})

})
