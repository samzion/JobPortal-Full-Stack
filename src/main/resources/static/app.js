let currentPage = 0; 
const pageSize = 5;

// Load jobs on page load
window.onload = function() {
    loadJobs(0, true); // firstLoad = true
}

// Load jobs function
function loadJobs(page, firstLoad = false) {
    currentPage = page;

    let keyword = "";
    let category = "";

    // Only get search values if not first load
    if (!firstLoad) {
        keyword = document.getElementById("searchInput").value.trim();
        category = document.getElementById("categorySelect").value.trim();
    }

    // Clear search inputs on first load
    if (firstLoad) {
        document.getElementById("searchInput").value = "";
        document.getElementById("categorySelect").value = "";
    }

    // Build API URL dynamically
    let url = `/api/jobs?page=${page}&size=${pageSize}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => renderJobs(data))
        .catch(err => console.error(err));
}

// Render jobs on the page
function renderJobs(data) {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    data.content.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-header" onclick="toggleDescription(${job.id})">
                <h3>${job.title} — ${job.company}</h3>
                <span>▼</span>
            </div>

            <p>${job.shortDescription}</p>

            <div id="desc-${job.id}" class="description">
                <p>${job.fullDescription}</p>
            </div>

            <div>
                <span class="like-btn" onclick="likeJob(${job.id}, event)">👍 ${job.likes}</span>
                <span class="dislike-btn" onclick="dislikeJob(${job.id}, event)">👎 ${job.dislikes}</span>
            </div>
        `;

        jobList.appendChild(card);
    });

    // Pagination buttons
    document.getElementById("prevBtn").disabled = data.first;
    document.getElementById("nextBtn").disabled = data.last;
}

// Toggle job description
function toggleDescription(id) {
    const desc = document.getElementById(`desc-${id}`);
    desc.style.display = desc.style.display === "block" ? "none" : "block";
}

// Like a job
function likeJob(id, event) {
    event.stopPropagation();
    fetch(`/api/jobs/${id}/like`, { method: "POST" })
        .then(() => loadJobs(currentPage));
}

// Dislike a job
function dislikeJob(id, event) {
    event.stopPropagation();
    fetch(`/api/jobs/${id}/dislike`, { method: "POST" })
        .then(() => loadJobs(currentPage));
}

// Pagination controls
function prevPage() {
    if (currentPage > 0) loadJobs(currentPage - 1);
}

function nextPage() {
    loadJobs(currentPage + 1);
}

// Add new job form submission
document.getElementById("newJobForm").addEventListener("submit", function(e){
    e.preventDefault();

    const title = document.getElementById("jobTitle").value.trim();
    const category = document.getElementById("jobCategory").value.trim();
    const description = document.getElementById("jobDescription").value.trim();

    if (!title || !category || !description) {
        alert("Please fill all fields!");
        return;
    }

    const newJob = {
        title: title,
        category: category,
        fullDescription: description,
        shortDescription: description.substring(0, 100) + (description.length > 100 ? "..." : "")
    };

    fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
    })
    .then(response => response.json())
    .then(data => {
        alert("Job added successfully!");
        document.getElementById("newJobForm").reset();
        loadJobs(0); // reload first page
    })
    .catch(err => console.error("Error adding job:", err));
});
