// Load data when page loads
fetch('/api/skills').then(r=>r.json()).then(data=>{
  document.getElementById('skills-list').innerHTML = 
    data.map(s=>`<div>${s.name}: ${s.level}%</div>`).join('');
});
fetch('/api/projects').then(r=>r.json()).then(data=>{
  document.getElementById('projects-list').innerHTML = 
    data.map(p=>`<div>${p.name} - ${p.desc}</div>`).join('');
});

// Contact form
document.getElementById('contact-form').onsubmit = async(e)=>{
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  await fetch('/api/contact', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  alert('Message sent!');
};
