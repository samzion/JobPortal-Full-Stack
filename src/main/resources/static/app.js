
const categoryMap = {};
let currentPage = 0;
let totalPages = 0;

document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 0) loadJobs(currentPage - 1);
});

document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < totalPages - 1) loadJobs(currentPage + 1);
});

document.getElementById("searchBtn").addEventListener("click", () => loadJobs(0));

document.getElementById("addJobBtn").addEventListener("click", () => {
    document.getElementById('add-new-job').scrollIntoView({ behavior: 'smooth' });
});

async function loadCategories() {
    const response = await fetch("http://localhost:8080/api/v1/categories");
    const categories = await response.json();

    const dropdown = document.getElementById("jobCategory");
    const dropdownAdd = document.getElementById("jobCategoryAdd");
    dropdown.innerHTML = '<option value="">-- All Category --</option>';
    dropdownAdd.innerHTML = '<option value="">-- Select Category --</option>';

    categories.forEach(c => {
        const name = c.name.trim(); // remove extra spaces
        categoryMap[c.id] = name;

        // Search dropdown
        const option = document.createElement("option");
        option.value = name; // exact name
        option.textContent = name;
        dropdown.appendChild(option);

        // Add Job dropdown
        const optionAdd = document.createElement("option");
        optionAdd.value = name;
        optionAdd.textContent = name;
        dropdownAdd.appendChild(optionAdd);
    });
}

function loadJobs(page = 0) {
    const keyword = document.getElementById("searchInput").value.trim() || null;
    console.log(`keyword = ${keyword}`);
    let categoryName = document.getElementById("jobCategory").value.trim();
    console.log(`CategoryName = ${categoryName}`);
    if (!categoryName) categoryName = null;

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", 6);
    if (keyword) params.append("keyword", keyword);
    if (categoryName) params.append("categoryName", categoryName);

    fetch(`http://localhost:8080/api/v1/jobs?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            renderJobs(data.content);
            currentPage = data.number;
            totalPages = data.totalPages;
            document.getElementById("prevBtn").disabled = currentPage === 0;
            document.getElementById("nextBtn").disabled = currentPage === totalPages - 1;
        })
        .catch(err => console.error(err));
}

function renderJobs(jobs) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    jobs.forEach(job => {
        const item = document.createElement("div");
        item.className = "job-card";
        item.innerHTML = `
            <h3>${job.title}</h3>
            <p><b>Company:</b> ${job.company}</p>
            <p><b>Category:</b> ${categoryMap[job.categoryId]}</p>
            <p>${job.description.substring(0, 120)}...</p>
        `;
        jobList.appendChild(item);
    });
}

// Add new job
document.getElementById("newJobForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("jobTitle").value.trim();
    const categoryName = document.getElementById("jobCategoryAdd").value.trim();
    const company = document.getElementById("company").value.trim();
    const description = document.getElementById("jobDescription").value.trim();

    if (!title || !categoryName || !company || !description) {
        alert("Please fill all fields!");
        return;
    }

   const categoryId = Object.keys(categoryMap)
        .find(id => categoryMap[id] === categoryName);

    if (!categoryId) {
        alert("Invalid category selected!");
        return;
    }

    const newJob = {
        title: title,
        categoryId: parseInt(categoryId),
        company: company,
        description: description
    };

    fetch("http://localhost:8080/api/v1/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
    })
        .then(res => res.json())
        .then(() => {
            alert("Job added!");
            document.getElementById("newJobForm").reset();
            loadJobs();
        })
        .catch(err => console.error("Error:", err));
});

window.onload = async function () {
    await loadCategories();
    loadJobs();
};

window.loadJobs = loadJobs;