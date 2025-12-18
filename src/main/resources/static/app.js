const STATUS_TOAST_EL = document.getElementById('statusToast');
const TOAST_MSG_EL = document.getElementById('toastMessage');
let STATUS_TOAST;

// We initialize it here to ensure Bootstrap is ready
if (STATUS_TOAST_EL) {
    STATUS_TOAST = new bootstrap.Toast(STATUS_TOAST_EL, { delay: 3000 });
}

const categoryMap = {};
let currentPage = 0;
let totalPages = 0;

// Elements
const JOB_LIST_CONTAINER = document.getElementById("jobList");
const PREV_BTN = document.getElementById("prevBtn");
const NEXT_BTN = document.getElementById("nextBtn");
const VISITOR_ID_KEY = 'jobFinderVisitorId'; 
const API_BASE = "http://localhost:8089/api/v1"; 

// Modals
const DETAILS_MODAL = new bootstrap.Modal(document.getElementById('jobDetailsModal'), {});
const ADD_JOB_MODAL = new bootstrap.Modal(document.getElementById('addJobModal'), {});

// Modal Content Elements
const DETAILS_TITLE = document.getElementById('jobDetailsTitle');
const DETAILS_COMPANY = document.getElementById('jobDetailsCompany');
const DETAILS_CATEGORY = document.getElementById('jobDetailsCategory');
const DETAILS_WHEN_POSTED = document.getElementById('jobDetailsWhenPosted');
const DETAILS_DESCRIPTION = document.getElementById('jobDetailsDescription');



/** Helper to show success/error toasts */
function showNotification(message, type = 'success') {
    console.log("Showing notification:", message); // Debug line
    TOAST_MSG_EL.textContent = message;
    
    // Reset classes
    STATUS_TOAST_EL.classList.remove('bg-success', 'bg-danger');
    
    // Add correct background
    if (type === 'success') STATUS_TOAST_EL.classList.add('bg-success');
    else STATUS_TOAST_EL.classList.add('bg-danger');
    
    STATUS_TOAST.show();
}


/** Ensures a unique visitor ID exists in localStorage */
function getOrCreateVisitorId() {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    return visitorId;
}

/** Utility to format date strings to relative time */
function formatRelativeTime(dateString) {
    const createdOn = new Date(dateString);
    if (isNaN(createdOn)) return "Recent"; // Fallback for invalid dates

    const now = new Date();
    const diffInSeconds = Math.floor((now - createdOn) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
}

/** Renders a loading spinner */
function renderLoadingState() {
    JOB_LIST_CONTAINER.innerHTML = `
        <div class="col-12 text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3">Fetching job listings...</p>
        </div>
    `;
}

// --- DATA ACTIONS ---

async function handleVote(jobId, voteType) {
    const visitorId = getOrCreateVisitorId();
    try {
        const response = await fetch(`${API_BASE}/jobs/${jobId}/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Visitor-ID": visitorId
            },
            body: JSON.stringify({ voteType: voteType.toUpperCase() })
        });

        if (!response.ok) throw new Error(`Vote failed: ${response.status}`);

        const updatedJob = await response.json();
        updateJobCardUI(jobId, updatedJob);
    } catch (err) {
        console.error("Voting error:", err);
    }
}

function updateJobCardUI(jobId, jobData) {
    const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
    if (!jobCard) return;

    const likeBtn = jobCard.querySelector('.vote-btn[data-vote-type="LIKE"]');
    const dislikeBtn = jobCard.querySelector('.vote-btn[data-vote-type="DISLIKE"]');
    const status = jobData.visitorVoteStatus;

    if (likeBtn) {
        likeBtn.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> ${jobData.likes}`;
        likeBtn.className = `btn btn-sm vote-btn ${status === 'LIKE' ? 'btn-success' : 'btn-outline-success'}`;
    }
    if (dislikeBtn) {
        dislikeBtn.innerHTML = `<i class="bi bi-hand-thumbs-down"></i> ${jobData.dislikes}`;
        dislikeBtn.className = `btn btn-sm vote-btn ms-2 ${status === 'DISLIKE' ? 'btn-danger' : 'btn-outline-danger'}`;
    }
}

async function viewJobDetails(jobId) {
    const visitorId = getOrCreateVisitorId();
    DETAILS_TITLE.textContent = "Loading...";
    DETAILS_MODAL.show();

    try {
        const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
            headers: { 'X-Visitor-ID': visitorId }
        });
        const job = await res.json();
        
        DETAILS_TITLE.textContent = job.title;
        DETAILS_COMPANY.textContent = job.company;
        DETAILS_CATEGORY.innerHTML = `<span class="badge bg-info text-dark">${categoryMap[job.categoryId] || 'Job'}</span>`;
        DETAILS_WHEN_POSTED.innerHTML = `Posted ${formatRelativeTime(job.createdOn)}`;
        DETAILS_DESCRIPTION.textContent = job.description;
    } catch (err) {
        DETAILS_TITLE.textContent = "Error";
        DETAILS_DESCRIPTION.textContent = "Could not load details.";
    }
}

// --- DATA LOADING ---

async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        const categories = await res.json();
        const d1 = document.getElementById("jobCategory");
        const d2 = document.getElementById("jobCategoryAdd");

        categories.forEach(c => {
            categoryMap[c.id] = c.name;
            d1.appendChild(new Option(c.name, c.name));
            d2.appendChild(new Option(c.name, c.name));
        });
    } catch (err) { console.error("Category load error", err); }
}

function loadJobs(page = 0) {
    renderLoadingState();
    const keyword = document.getElementById("searchInput").value.trim();
    const category = document.getElementById("jobCategory").value;
    const sortBy = document.getElementById("sortBy").value || "date";

    const params = new URLSearchParams({ page, size: 6, sortBy });
    if (keyword) params.append("keyword", keyword);
    if (category) params.append("categoryName", category);

    fetch(`${API_BASE}/jobs?${params.toString()}`, {
        headers: { 'X-Visitor-ID': getOrCreateVisitorId() }
    })
    .then(res => res.json())
    .then(data => {
        currentPage = data.number;
        totalPages = data.totalPages;
        renderJobs(data.content || []);
        
        PREV_BTN.disabled = currentPage === 0;
        NEXT_BTN.disabled = currentPage >= totalPages - 1;
    })
    .catch(() => {
        JOB_LIST_CONTAINER.innerHTML = `<div class="alert alert-danger w-100">Error connecting to server.</div>`;
    });
}

function renderJobs(jobs) {
    JOB_LIST_CONTAINER.innerHTML = jobs.length ? "" : `<div class="alert alert-info w-100">No jobs found.</div>`;

    jobs.forEach(job => {
        const isLiked = job.visitorVoteStatus === 'LIKE';
        const isDisliked = job.visitorVoteStatus === 'DISLIKE';

        const html = `
        <div class="col" data-job-id="${job.id}">
            <div class="card shadow-sm h-100 job-card"> <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary fw-bold">${job.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted small">${job.company}</h6>
                
                <div class="my-2">
                    <span class="badge bg-info text-dark">${categoryMap[job.categoryId] || 'General'}</span>
                </div>
                
                <p class="small text-muted mb-2">
                    <i class="bi bi-clock me-1"></i> ${formatRelativeTime(job.createdOn)}
                </p>
                
                <p class="card-text text-truncate-3 mb-4">${job.description}</p>
                
                <div class="mt-auto d-flex align-items-center pt-3 border-top">
                    <div class="btn-group">
                        <button class="btn btn-sm ${isLiked ? 'btn-success' : 'btn-outline-success'} vote-btn" 
                                onclick="handleVote(${job.id}, 'LIKE')" data-vote-type="LIKE">
                            <i class="bi bi-hand-thumbs-up"></i> ${job.likes}
                        </button>
                        <button class="btn btn-sm ${isDisliked ? 'btn-danger' : 'btn-outline-danger'} vote-btn" 
                                onclick="handleVote(${job.id}, 'DISLIKE')" data-vote-type="DISLIKE">
                            <i class="bi bi-hand-thumbs-down"></i> ${job.dislikes}
                        </button>
                    </div>

                    <button class="btn btn-sm btn-primary ms-auto px-3 fw-bold shadow-sm" onclick="viewJobDetails(${job.id})">
                        View Details <i class="bi bi-arrow-right-short"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
        JOB_LIST_CONTAINER.insertAdjacentHTML('beforeend', html);
    });
}

// --- LISTENERS ---

document.getElementById("newJobForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    console.log("Form submission triggered!");
    const submitBtn = document.getElementById("submitJobBtn");
    
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Posting...`;
    
    // Reverse Map Category Name to ID
    const catName = document.getElementById("jobCategoryAdd").value;
    const catId = Object.keys(categoryMap).find(key => categoryMap[key] === catName);

    const payload = {
        title: document.getElementById("jobTitle").value,
        company: document.getElementById("company").value,
        description: document.getElementById("jobDescription").value,
        categoryId: parseInt(catId)
    };

    try {
        
        const res = await fetch(`${API_BASE}/jobs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showNotification("Job Posted Successfully!", "success"); // Improved
            this.reset();
            ADD_JOB_MODAL.hide();
            loadJobs(0);
        } else {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Server rejected the request");
        }
    } catch (err) {
        showNotification("Failed to save job. Please try again.", "danger"); // Improved
    } 
    finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Job";
    }
});

document.getElementById("addJobBtn").addEventListener("click", () => ADD_JOB_MODAL.show());
document.getElementById("searchBtn").addEventListener("click", () => loadJobs(0));
PREV_BTN.addEventListener("click", () => loadJobs(currentPage - 1));
NEXT_BTN.addEventListener("click", () => loadJobs(currentPage + 1));

// Initialize
window.onload = async () => {
    getOrCreateVisitorId();
    await loadCategories();
    loadJobs();
};

window.viewJobDetails = viewJobDetails;
window.handleVote = handleVote;