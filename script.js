// Replace this AFTER you deploy backend on Render:
const API_URL = "YOUR_BACKEND_URL_HERE";

// Load vents on page load
async function loadVents() {
  const res = await fetch(`${API_URL}/vents`);
  const vents = await res.json();

  const ventList = document.getElementById("ventList");
  ventList.innerHTML = "";

  vents.forEach(v => {
    const div = document.createElement("div");
    div.className = "vent";

    div.innerHTML = `
      <div class="vent-number">#${v.id}</div>
      <div class="vent-text">${v.text}</div>

      <div class="comment-section" id="comments-${v.id}">
        ${v.comments.map(c => `<div class="comment">${c.text}</div>`).join("")}
      </div>

      <textarea id="commentInput-${v.id}" class="commentInput" placeholder="Add a comment..."></textarea>
      <button onclick="postComment(${v.id})">Post Comment</button>
    `;

    ventList.appendChild(div);
  });
}

// Post a new vent
async function postVent() {
  const text = document.getElementById("ventInput").value.trim();
  if (!text) return;

  await fetch(`${API_URL}/vents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  document.getElementById("ventInput").value = "";
  loadVents();
}

// Post a comment
async function postComment(id) {
  const input = document.getElementById(`commentInput-${id}`);
  const text = input.value.trim();
  if (!text) return;

  await fetch(`${API_URL}/vents/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  input.value = "";
  loadVents();
}

document.getElementById("submitVent").addEventListener("click", postVent);

// Load vents at start
loadVents();
