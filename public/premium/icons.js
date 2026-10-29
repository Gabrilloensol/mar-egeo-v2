// Original line symbols for this edition, in a shared 64 × 64 grid.
const paths={
 zeus:'<path d="M38 5 17 35h15l-7 24 24-34H33z"/>',
 hera:'<path d="m10 20 9 7 13-15 13 15 9-7-6 28H16zM17 41h30M21 52h22"/><circle cx="32" cy="33" r="3"/>',
 poseidon:'<path d="M32 7v51M13 13v17q0 10 19 10t19-10V13M26 14l6-8 6 8M7 20l6-8 6 8M45 20l6-8 6 8M24 57h16"/>',
 demeter:'<path d="M30 58V11M30 23Q13 24 16 9q14 0 14 14ZM30 35Q10 37 12 22q14-1 18 13ZM30 47Q11 50 11 35q13-1 19 12ZM32 29Q48 28 48 13q-14 1-16 16ZM32 43Q52 43 51 27q-14 0-19 16Z"/>',
 atenea:'<path d="M15 52V31c0-22 34-22 34 0v21H36V38H22v14zM16 30h32M32 10V4M33 4q20 0 23 23M24 39v10M15 57h34"/>',
 apolo:'<path d="M18 11q-8 24 1 35t26 0q9-11 1-35M18 13q14 12 28 0M19 33h26M23 21v29M29 23v30M35 23v30M41 21v29M20 57h24"/>',
 artemisa:'<path d="M18 7q42 25 0 50L18 7ZM10 32h47M49 24l8 8-8 8M8 27l6 5-6 5"/>',
 ares:'<path d="M11 17h30v17q0 16-15 23Q11 50 11 34zM26 22v27M17 33h18M48 9v45M42 16l6-11 6 11z"/>',
 afrodita:'<path d="M9 43q13-2 17-12Q11 14 20 10q13 6 19 22 12-13 19-9-3 12-14 18-3 17-19 14M31 42q-8 11-22 1ZM40 27l10-6M47 50l-4 8M53 48l-3 8"/>',
 hefesto:'<path d="m14 10 29 5-2 11-29-5zM27 24l-6 26M9 37h46l-6 10H18zM26 47v9M18 57h31M41 47v9"/>',
 hermes:'<path d="M32 8v50M13 12q12-8 19 8 7-16 19-8-8 9-19 8-11 1-19-8ZM22 24c-20 10 38 20 18 31M42 24c20 10-38 20-18 31"/>',
 dioniso:'<path d="M33 8q-3 10 2 17M34 15Q46 0 55 14q-5 13-21 1ZM18 29q15-8 30 0v11q-2 16-15 19-13-3-15-19zM24 35l5 2M37 37l5-2M25 45q8 11 16 0"/>',
 hestia:'<path d="M32 5q2 15 11 22 17 19-3 29H23Q5 45 21 30q-3 16 6 15-7-21 5-40ZM12 59h40"/>',
 hades:'<path d="M12 56V27a20 20 0 0 1 40 0v29M20 56V28a12 12 0 0 1 24 0v28M7 57h50M32 16v40M23 36h18"/>',
 persefone:'<path d="m26 15-5-9 11 4 11-4-5 9M27 16Q9 22 11 38q1 20 21 21t21-21Q55 22 37 16ZM32 22v30"/><circle cx="22" cy="32" r="2"/><circle cx="22" cy="43" r="2"/><circle cx="42" cy="32" r="2"/><circle cx="42" cy="43" r="2"/>'
};
export const icon=id=>`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id]||paths.apolo}</svg>`;
