let allProjects = [] // projets
  
let categories =[] //filtres

let authToken = null


function fetchProjects (){
 fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(response => {
        allProjects = response
        displayProjects(allProjects) 
    } ) 
    .catch(error => alert("Erreur : " + error));
}   

function fetchCategories (){
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(response => {
      categories = response;
      displayCategories(categories);
    })
    .catch(error => alert("Erreur : " + error));
}


////Function pour les projet dynamique 
function displayProjects(projects) {
    const galleryContainer = document.querySelector("#portfolio .gallery");
    while (galleryContainer.firstChild) {
      galleryContainer.removeChild(galleryContainer.firstChild);
    }
  
    projects.forEach(project => {
      const projectItem = document.createElement("figure");
      const projectImage = document.createElement("img");
      const projectCaption = document.createElement("figcaption");
  
      projectImage.src = project.imageUrl; 
      projectImage.alt = project.title; 
      projectCaption.textContent = project.title;
      projectItem.appendChild(projectImage);
      projectItem.appendChild(projectCaption);
      galleryContainer.appendChild(projectItem);
    });
  }

  /////Function pour les bouton filtres
  function displayCategories(categories) {
    const categoriesContainer = document.querySelector("#portfolio .categories");
    const allProjectsButton = document.createElement("button");

    allProjectsButton.textContent = "Tous";
    allProjectsButton.classList.add("category-button");
    allProjectsButton.setAttribute("data-category-id", "all");
    allProjectsButton.addEventListener("click", () => displayProjects(allProjects));
    categoriesContainer.appendChild(allProjectsButton);

    categories.forEach(category => {
        const categoryButton = document.createElement("button");
        categoryButton.textContent = category.name;
        categoryButton.classList.add("category-button");
        categoryButton.setAttribute("data-category-id", category.id);
        categoryButton.addEventListener("click", () => filterProjectsByCategory(category.id));
        categoriesContainer.appendChild(categoryButton);
    });
}

function filterProjectsByCategory(categoryId) {
    if (categoryId === "all") {
        displayProjects(allProjects);
    } else {
        const filteredProjects = allProjects.filter(project => project.categoryId === categoryId);
        displayProjects(filteredProjects);
    }
}

fetchProjects()
fetchCategories()


//// Function pour changé la page index quand le token et la et suppr le token
document.addEventListener("DOMContentLoaded", function () {
  const loginLink = document.querySelector(".login-link");
   authToken = localStorage.getItem("authToken");
  const topBar = document.querySelector(".top-bar");
  const projectsButton = document.querySelector(".modal-icon .js-modal");
  const categoriesContainer = document.querySelector("#portfolio .categories");

  if (authToken) {
    loginLink.textContent = "Logout";
    loginLink.classList.add("logout-button");
    topBar.style.display = "flex";
    projectsButton.style.display = "inline-block"; 
    categoriesContainer.style.display = "none";
  } else {
    loginLink.textContent = "Login";
    topBar.style.display = "none";
    projectsButton.style.display = "none";
    categoriesContainer.style.display = "flex"; 
  }

  loginLink.addEventListener("click", function () {
    if (authToken) {
      localStorage.removeItem("authToken");
      window.location.href = "./index.html";
    } else {
      window.location.href = "./login/login.html";
    }
  });
});


///// OUVRIR LA MODAL ET CREE LES PROJECTS AVEC LES ICON POUR SUPPRIMER 
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector("#modal1");
  target.style.display = 'flex';
  target.setAttribute('aria-hidden', 'false');
  target.setAttribute('aria-modal', 'true');

  const closeBtn = target.querySelector(".fa-xmark");
  closeBtn.addEventListener("click", closeModal);

  
  updateModalProjects();

  target.addEventListener("click", (event) => {
    if (event.target === target) {
      closeModal();
    }
  });
}

function updateModalProjects() {
  const modalProjectsContainer = document.querySelector("#modalProjects");
  while (modalProjectsContainer.firstChild) {
    modalProjectsContainer.removeChild(modalProjectsContainer.firstChild);
  }

  allProjects.forEach((project) => {
    const projectItem = document.createElement("figure");
    const projectImage = document.createElement("img");

    projectImage.src = project.imageUrl;
    projectImage.alt = project.title;
    projectItem.appendChild(projectImage);
    projectItem.appendChild(createDeleteButton(project.id));
    modalProjectsContainer.appendChild(projectItem);
  });
}

function createDeleteButton(projectId) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => deleteProject(projectId));
  return deleteButton;
}

function deleteProject(projectId) {
  fetch(`http://localhost:5678/api/works/${projectId}`,{
    method:'DELETE',
    headers:{
      Authorization: `Bearer ${authToken}`
    }
  })
  .then(response => {
    if(response.ok){
      allProjects = allProjects.filter(project => project.id !== projectId);
      
      updateModalProjects();
      displayProjects(allProjects);
  }
  })}

// Function pour fermé 
const closeModal = function () {
  const target = document.querySelector("#modal1");
  target.style.display = 'none';
  target.setAttribute('aria-hidden', 'true');
  target.removeAttribute('aria-modal');
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
});


////////// 2 EME MODAL ////////////
document.addEventListener("DOMContentLoaded", function () {
  const openSecondModalButton = document.querySelector(".open-second-modal");
  const secondModal = document.querySelector("#modal-2");
  const backToFirstModalButton = document.querySelector("#back-to-first-modal");
  const firstModal = document.querySelector("#modal1");

  openSecondModalButton.addEventListener("click", function () {
    secondModal.style.display = "flex";
    secondModal.setAttribute('aria-hidden', 'false');
    secondModal.setAttribute('aria-modal', 'true');

    firstModal.style.display = "none";
    firstModal.setAttribute('aria-hidden', 'true');
    firstModal.removeAttribute('aria-modal');
  });

  backToFirstModalButton.addEventListener("click", function () {
    firstModal.style.display = "flex";
    firstModal.setAttribute('aria-hidden', 'false');
    firstModal.setAttribute('aria-modal', 'true');

    secondModal.style.display = "none";
    secondModal.setAttribute('aria-hidden', 'true');
    secondModal.removeAttribute('aria-modal');
  });
  
  secondModal.addEventListener("click", function (event) {
    if (event.target === secondModal || event.target.classList.contains("fa-xmark")) {
      secondModal.style.display = "none";
      secondModal.setAttribute('aria-hidden', 'true');
      secondModal.removeAttribute('aria-modal');

      firstModal.style.display = "none";
      firstModal.setAttribute('aria-hidden', 'true');
      firstModal.removeAttribute('aria-modal');
    }
  });
});
