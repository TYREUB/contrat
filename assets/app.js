document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contract-form');
	const fields = {
		employer: document.getElementById('input-employer'),
		employee: document.getElementById('input-employee'),
		grade: document.getElementById('input-grade'),
		recruiting_grade: document.getElementById('input-recruiting-grade'),
		start_date: document.getElementById('input-start-date'),
			hours: document.getElementById('input-hours'),
		signatory_grade: document.getElementById('input-signatory-grade'),
			signatory_name: document.getElementById('input-signatory-name')
	};
		const logoInput = document.getElementById('input-logo');
		const logoImg = document.getElementById('contract-logo-img');

	if (!fields.start_date.value) {
		const now = new Date();
		const dd = String(now.getDate()).padStart(2, '0');
		const mm = String(now.getMonth() + 1).padStart(2, '0');
		const yyyy = now.getFullYear();
		fields.start_date.value = `${dd}/${mm}/${yyyy}`;
	}

	const fill = () => {
		const get = (k, fallback = '') => (fields[k].value || fallback).trim();
		const mapping = {
			employer: get('employer', 'Burger Shot Blaine County'),
			employee: get('employee', 'Nom Prénom'),
			grade: get('grade', 'apprenti'),
			recruiting_grade: get('recruiting_grade', 'gérant'),
			start_date: get('start_date'),
			hours: get('hours', '15'),
			signatory_grade: get('signatory_grade', 'Responsable RH'),
			signatory_name: get('signatory_name', 'Garcia Lia')
		};
		for (const [key, value] of Object.entries(mapping)) {
			document.querySelectorAll(`[data-text="${key}"]`).forEach(el => el.textContent = value);
		}
		drawSignature(mapping.signatory_name);
	};

	fill();
	form.addEventListener('input', fill);
	document.getElementById('btn-preview').addEventListener('click', fill);
	document.getElementById('btn-export').addEventListener('click', () => {
		fill();
		window.print();
	});

	// Draw a faux handwritten signature on canvas
	function drawSignature(name) {
		const canvas = document.getElementById('signature-canvas');
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		const W = canvas.width, H = canvas.height;
		ctx.clearRect(0, 0, W, H);

		// Baseline line
		ctx.strokeStyle = '#444';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(10, H - 25);
		ctx.lineTo(W - 10, H - 25);
		ctx.stroke();

		// Signature text (cursive fallback chain)
		ctx.fillStyle = '#111';
		ctx.font = "48px 'Brush Script MT','Segoe Script','Lucida Handwriting','Dancing Script',cursive";
		ctx.save();
		ctx.transform(1, 0, -0.15, 1, 0, 0); // slight italic skew
		const text = name || 'Signature';
		ctx.fillText(text, 20, H - 40);
		ctx.restore();

		// Flourish wave
		ctx.strokeStyle = '#111';
		ctx.lineWidth = 1.3;
		ctx.beginPath();
		ctx.moveTo(20, H - 22);
		for (let x = 20; x < W - 20; x += 4) {
			const y = H - 22 + Math.sin(x / 12) * 2.2;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	}

		// Load logo from file input as Data URL
			if (logoInput && logoImg) {
				const wrapper = document.getElementById('contract-logo-wrapper');
				function checkInitial() {
					if (logoImg.complete) {
						if (!logoImg.naturalWidth) {
							wrapper.style.display = 'none';
						}
					}
				}
				logoImg.addEventListener('error', () => { wrapper.style.display = 'none'; });
				logoImg.addEventListener('load', () => { wrapper.style.display = 'block'; });
				checkInitial();
				logoInput.addEventListener('change', () => {
					const file = logoInput.files && logoInput.files[0];
					if (!file) return;
					const reader = new FileReader();
					reader.onload = (e) => {
						logoImg.src = e.target.result;
						wrapper.style.display = 'block';
					};
					reader.readAsDataURL(file);
				});
			}
});