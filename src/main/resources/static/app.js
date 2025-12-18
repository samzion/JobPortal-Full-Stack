
const categoryMap = {};
let currentPage = 0;
let totalPages = 0;
const ADD_JOB_SECTION = document.getElementById('add-new-job');
const JOB_LIST_CONTAINER = document.getElementById("jobList");
const PREV_BTN = document.getElementById("prevBtn");
const NEXT_BTN = document.getElementById("nextBtn");
const VISITOR_ID_KEY = 'jobFinderVisitorId'; // Key for local storage
const API_BASE = "http://localhost:8089/api/v1"; // Base URL for API
const DETAILS_MODAL = new bootstrap.Modal(document.getElementById('jobDetailsModal'), {});
const DETAILS_TITLE = document.getElementById('jobDetailsTitle');
const DETAILS_COMPANY = document.getElementById('jobDetailsCompany');
const DETAILS_CATEGORY = document.getElementById('jobDetailsCategory');
const DETAILS_DESCRIPTION = document.getElementById('jobDetailsDescription');



/** Ensures a unique visitor ID exists in localStorage for vote tracking */
function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
}


function toggleAddJobForm(isVisible) {
    ADD_JOB_SECTION.classList.toggle('d-none', !isVisible);
}

/** Renders a loading spinner in the job list area */
function renderLoadingState() {
    JOB_LIST_CONTAINER.innerHTML = `
        <div class="col-12 text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Fetching job listings...</p>
        </div>
    `;
}

// Updates only the relevant card without reloading the page
function updateJobCardUI(jobId, jobData) {
    // 1. Locate the job card container using the unique data-job-id attribute
    const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);

    if (!jobCard) {
        console.warn(`Job card element not found for ID: ${jobId}.`);
        return;
    }

    // 2. Locate the specific like/dislike buttons
    const likeButton = jobCard.querySelector('.vote-btn[data-vote-type="LIKE"]');
    const dislikeButton = jobCard.querySelector('.vote-btn[data-vote-type="DISLIKE"]');

    const status = jobData.visitorVoteStatus; // e.g., "LIKE", "DISLIKE", or null

    // 3. Update the Like Button Text and Style
    if (likeButton) {
        likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> ${jobData.likes}`;
        likeButton.className = status === 'LIKE'
                               ? 'btn btn-sm btn-success vote-btn'
                               : 'btn btn-sm btn-outline-success vote-btn';
    }

    // 4. Update the Dislike Button Text and Style
    if (dislikeButton) {
        dislikeButton.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> ${jobData.dislikes}`;
        dislikeButton.className = status === 'DISLIKE'
                                  ? 'btn btn-sm btn-danger vote-btn ms-2'
                                  : 'btn btn-sm btn-outline-danger vote-btn ms-2';
    }
}


// --- EVENT LISTENERS ---

PREV_BTN.addEventListener("click", () => {
    if (currentPage > 0) loadJobs(currentPage - 1);
});

NEXT_BTN.addEventListener("click", () => {
    if (currentPage < totalPages - 1) loadJobs(currentPage + 1);
});

document.getElementById("searchBtn").addEventListener("click", () => loadJobs(0));

document.getElementById("addJobBtn").addEventListener("click", () => {
    toggleAddJobForm(true);
    ADD_JOB_SECTION.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#add-new-job .btn-secondary').addEventListener('click', () => {
    toggleAddJobForm(false);
});


// --- VOTE ACTION ---

//Handles the vote request and updates only the single job card
async function handleVote(jobId, voteType) {
    const visitorId = getOrCreateVisitorId();
    const endpoint = `${API_BASE}/jobs/${jobId}/vote`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

                "X-Visitor-ID": visitorId
            },
            body: JSON.stringify({
                voteType: voteType.toUpperCase()
            })
        });

        if (!response.ok) {
            throw new Error(`Server failed to process vote. Status: ${response.status}`);
        }

        //                                                                                                                                                                       Parse the single updated Job DTO returned by the server
        const updatedJob = await response.json();

        // Update the specific job card UI (non-disruptive)
        updateJobCardUI(jobId, updatedJob);

    } catch (err) {
        console.error("Voting error:", err);
        alert(`Could not submit vote: ${err.message}`);
    }
}

async function viewJobDetails(jobId) {
    const visitorId = getOrCreateVisitorId();
    const endpoint = `${API_BASE}/jobs/${jobId}`;

    // Clear previous details and show a loading state
    DETAILS_TITLE.textContent = "Loading...";
    DETAILS_COMPANY.textContent = "";
    DETAILS_CATEGORY.textContent = "";
    DETAILS_DESCRIPTION.textContent = "Fetching full description...";
    DETAILS_MODAL.show(); // Show modal immediately

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-Visitor-ID': visitorId // Still send for consistent access/logging
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch job ${jobId}. Status: ${response.status}`);
        }

        const job = await response.json();
        const categoryName = categoryMap[job.categoryId] || 'Uncategorized';

        // Populate the modal with job data
        DETAILS_TITLE.textContent = job.title;
        DETAILS_COMPANY.textContent = job.company;
        DETAILS_CATEGORY.innerHTML = `<span class="badge bg-info text-dark">${categoryName}</span>`;
        DETAILS_DESCRIPTION.textContent = job.description;

    } catch (err) {
        console.error("Error viewing job details:", err);
        DETAILS_TITLE.textContent = "Error";
        DETAILS_DESCRIPTION.textContent = `Could not load job details: ${err.message}`;
    }
}


window.viewJobDetails = viewJobDetails;

// --- DATA LOADING FUNCTIONS ---

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories.");

        const categories = await response.json();

        const dropdown = document.getElementById("jobCategory");
        const dropdownAdd = document.getElementById("jobCategoryAdd");

        dropdown.innerHTML = '<option value="">-- All Category --</option>';
        dropdownAdd.innerHTML = '<option value="">-- Select Category --</option>';

        categories.forEach(c => {
            const name = c.name.trim();
            categoryMap[c.id] = name;

            dropdown.appendChild(new Option(name, name));
            dropdownAdd.appendChild(new Option(name, name));
        });
    } catch (err) {
        console.error("Error loading categories:", err);
    }
}

function loadJobs(page = 0) {
    renderLoadingState();

    const keyword = document.getElementById("searchInput").value.trim() || null;
    let categoryName = document.getElementById("jobCategory").value.trim() || null;
    let sortBy = document.getElementById("sortBy").value.trim() || "date";
    const visitorId = getOrCreateVisitorId(); // Get the ID to send

    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", 6);
    params.append("sortBy", sortBy);
    if (keyword) params.append("keyword", keyword);
    if (categoryName) params.append("categoryName", categoryName);

    fetch(`${API_BASE}/jobs?${params.toString()}`, {
        method: 'GET',
        headers: {
            // CRITICAL: Send visitorId with GET request for personalized vote status
            'X-Visitor-ID': visitorId
        }
    })
    .then(res => {
        if (!res.ok) {
            // Log the error response body if possible
            console.error("Fetch failed with status:", res.status);
            throw new Error(`Failed to load jobs: HTTP ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const jobs = data && Array.isArray(data.content) ? data.content : [];
        renderJobs(jobs);
        // Update pagination only if data is valid
        if (data) {
            currentPage = data.number;
            totalPages = data.totalPages;
        } else {
             currentPage = 0; // Handle case where data is missing
             totalPages = 0;
        }

        PREV_BTN.disabled = currentPage === 0;
        NEXT_BTN.disabled = currentPage === totalPages - 1 || totalPages === 0;
    })
    .catch(err => {
        console.error("Error fetching jobs:", err);
        JOB_LIST_CONTAINER.innerHTML = `
            <div class="col-12 alert alert-danger" role="alert">
                Failed to load job listings. Check the server status.
            </div>
        `;
    });
}

// --- UI RENDERING ---

function renderJobs(jobs) {
    JOB_LIST_CONTAINER.innerHTML = "";

    if (jobs.length === 0) {
        JOB_LIST_CONTAINER.innerHTML = `
            <div class="col-12 alert alert-info" role="alert">
                No jobs found matching your criteria.
            </div>
        `;
        return;
    }

    jobs.forEach(job => {
        const categoryName = categoryMap[job.categoryId] || 'Uncategorized';

        // Determine initial button states based on visitorVoteStatus
        // The status is passed from the server in the JobDto
        const isLiked = job.visitorVoteStatus === 'LIKE';
        const isDisliked = job.visitorVoteStatus === 'DISLIKE';

        const likeClass = isLiked ? 'btn-success' : 'btn-outline-success';
        const dislikeClass = isDisliked ? 'btn-danger' : 'btn-outline-danger';

        const jobCardHTML = `
            <div class="col" data-job-id="${job.id}"> <div class="card shadow-sm h-100">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary">${job.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${job.company}</h6>

                        <div class="my-2">
                            <span class="badge bg-info text-dark">${categoryName}</span>
                        </div>
                        <p class="text-muted"></p>
                        <p class="card-text mb-4">
                            ${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}
                        </p>

                        <div class="mt-auto vote-controls d-flex align-items-center">
                            <button class="btn btn-sm ${likeClass} vote-btn"
                                    data-vote-type="LIKE"
                                    onclick="handleVote(${job.id}, 'LIKE')">
                                <i class="bi bi-hand-thumbs-up"></i> ${job.likes}
                            </button>

                            <button class="btn btn-sm ${dislikeClass} vote-btn ms-2"
                                    data-vote-type="DISLIKE"
                                    onclick="handleVote(${job.id}, 'DISLIKE')">
                                <i class="bi bi-hand-thumbs-down"></i> ${job.dislikes}
                            </button>

                            <button class="btn btn-sm btn-outline-secondary ms-auto"
                                    onclick="viewJobDetails(${job.id})">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Using innerHTML is fine here since you clear the container first.
        JOB_LIST_CONTAINER.insertAdjacentHTML('beforeend', jobCardHTML);
    });
}

// --- FORM SUBMISSION ---

document.getElementById("newJobForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const title = document.getElementById("jobTitle").value.trim();
    // Assuming jobCategoryAdd holds the category NAME for mapping
    const categoryName = document.getElementById("jobCategoryAdd").value.trim();
    const company = document.getElementById("company").value.trim();
    const description = document.getElementById("jobDescription").value.trim();

    // Reverse lookup the Category ID from the Name
    const categoryId = Object.keys(categoryMap)
        .find(id => categoryMap[id] === categoryName);

    if (!categoryId) {
        alert("Invalid category selected!");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Job Listing";
        return;
    }

    const newJob = {
        title: title,
        categoryId: parseInt(categoryId), // Ensure it's an integer for the API request
        company: company,
        description: description
    };

    fetch(`${API_BASE}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob)
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to add job.");
            return res.json();
        })
        .then(() => {
            alert("Job added successfully!");
            document.getElementById("newJobForm").reset();
            this.classList.remove('was-validated');
            toggleAddJobForm(false);
            loadJobs(); // Reload the list to show the new job
        })
        .catch(err => {
            console.error("Error adding job:", err);
            alert("Error: Could not save job listing.");
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Job Listing";
        });
});

// INITIALIZATION

window.onload = async function () {
    // Generate/Retrieve the visitor ID immediately
    getOrCreateVisitorId();

    // Hide the form initially
    toggleAddJobForm(false);

    await loadCategories();
    loadJobs();
};

// Exposing handleVote globally so it can be called from the onclick attribute
window.handleVote = handleVote;