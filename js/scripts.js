/*######################################################################################*/
/*						VIDEO PRESENTACIÓN LOOP ENTRE DOS PUNTOS  					 	*/
/*######################################################################################*/
//const video = document.getElementById('miVideo');
//const start = 12;  // Punto de inicio en segundos (12 para quitar el logo inicial)
//const end = 100;   // Punto de finalización en segundos (100 para quitar el logo final)
//
//video.addEventListener('timeupdate', function() {
//	if (video.currentTime >= end) {
//		video.currentTime = start;  // Reiniciar al punto de inicio del bucle
//		video.play();  // Continuar la reproducción
//	}
//});
//
//video.addEventListener('loadedmetadata', function() {
//	video.currentTime = start;  // Iniciar el video desde el punto especificado
//	video.play();
//});

//function resetAllMedia() {
//	// Detener y recargar todos los videos HTML5
//	const videos = document.querySelectorAll('video');
//	videos.forEach(video => {
//		video.pause(); // Pausa el video
//		video.currentTime = 0; // Lo lleva al inicio
//		video.load(); // Vuelve a cargar el video para mostrar el poster
//	});
//
//	// Pausar todos los iframes de YouTube
//	const iframes = document.querySelectorAll('iframe');
//	iframes.forEach(iframe => {
//		const src = iframe.src;
//		if (src.includes("youtube.com")) {
//			// Pausar video usando la API de YouTube
//			iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
//		} else {
//			// Para otros iframes, usar el método de recarga
//			iframe.src = '';
//			iframe.src = src;
//		}
//	});
//}

/*######################################################################################*/
/*										GOOGLE ANALYTICS								*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', function() {
	var downloadLink = document.getElementById('download-template');
	var externalLink = document.getElementById('external-link');
	var linkedinLink = document.getElementById('linkedin-link');
	var youtubeLink = document.getElementById('youtube-link');
	
	if (downloadLink) {
	  downloadLink.addEventListener('click', function() {
		gtag('event', 'click_download', {
		  'event_category': 'Files',
		  'event_label': 'Template de robótica',
		  'value': 1
		});
	  });
	}
	
	if (externalLink) {
	  externalLink.addEventListener('click', function() {
		gtag('event', 'click_external', {
		  'event_category': 'External Link',
		  'event_label': 'Schneider Electric',
		  'value': 1
		});
	  });
	}
	
	if (linkedinLink) {
	  linkedinLink.addEventListener('click', function() {
		gtag('event', 'click_linkedin', {
		  'event_category': 'Social Media',
		  'event_label': 'Linkedin',
		  'value': 1
		});
	  });
	}
	
	if (youtubeLink) {
	  youtubeLink.addEventListener('click', function() {
		gtag('event', 'click_youtube', {
		  'event_category': 'Social Media',
		  'event_label': 'Youtube',
		  'value': 1
		});
	  });
	}
});
	
/*######################################################################################*/
/*						DESPLIEGUE Y COLAPSO DE TEXTO TRANSCRIPCION						*/
/*######################################################################################*/
/* Esta sección de código funciona con todas las instancias del controlador de tipo transcripcion-header */
document.addEventListener("DOMContentLoaded", function() {
    // Buscar el título del curso
    const courseTitleElement = document.querySelector('.course-title');

    // Solo proceder si el elemento existe
    if (courseTitleElement) {
        const courseTitle = courseTitleElement.textContent.trim();

        // Buscar los encabezados de las transcripciones
        const headers = document.querySelectorAll('.transcripcion-header');

        headers.forEach(header => {
            const icon = header.querySelector('.transcripcion-icon');
            const content = header.nextElementSibling;

            header.addEventListener('click', function() {
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';
                icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';

                // Capturar los datos del curso y la lección
                const leccion = header.getAttribute('data-leccion');

                // Agregar evento de gtag solo cuando se abre la transcripción para enviar evento a Google Analytics
                if (!isVisible) {
                    gtag('event', 'open_transcripcion', {
                        'event_category': 'Transcripción',
                        'event_label': `${courseTitle} - Lección: ${leccion}`
                    });
                }
            });
        });
    }
});

/*######################################################################################*/
/*	  NAVEGACION ENTRE CLASES (DESDE BOTONES ANTERIOR/POSTERIOR Y DEDE MENU LATERAL 	*/
/*######################################################################################*/
document.addEventListener("DOMContentLoaded", function() {
   // Buscar el título del curso
    const courseTitleElement = document.querySelector('.course-title');

    // Solo proceder si el elemento existe
    if (courseTitleElement) {
        const courseTitle = courseTitleElement.textContent.trim();	
		const capitulos = document.querySelectorAll('.capitulo-container');
		const menuItems = document.querySelectorAll('.side-menu ul li a'); // Selecciona las opciones del menú
		const introSection = document.querySelector('.intro-section'); // Sección de encabezado que deseas mostrar/ocultar
		let currentIndex = 0;

		function updateIframesVisibility() {
			// Recorre todos los capítulos
			capitulos.forEach((capitulo, index) => {
				const iframes = capitulo.querySelectorAll('iframe');
				if (capitulo.style.display === 'flex') {  // Si el capítulo es visible
					iframes.forEach(iframe => {
						const dataSrc = iframe.getAttribute('data-src');
						if (dataSrc) {
							iframe.setAttribute('src', dataSrc);  // Asigna el valor de data-src a src
						}
					});
				} else {  // Si el capítulo está oculto
					iframes.forEach(iframe => {
						iframe.removeAttribute('src');  // Elimina el atributo src
					});
				}
			});
		}

		function showCapitulo(index) {
			// Cierra todas las transcripciones antes de cambiar de capítulo
			closeAllTranscriptions();
			
			// Pausar y reiniciar todos los videos antes de cambiar de sección
			//resetAllMedia();

			// Actualiza el índice actual
			currentIndex = index;
			
			// Muestra el capítulo correspondiente y oculta los demás
			capitulos.forEach((capitulo, i) => {
				capitulo.style.display = i === index ? 'flex' : 'none';
			});
			
			// Mostrar u ocultar la sección de encabezado según el capítulo
			if (index === 0) {
				introSection.style.display = 'flex'; // Mostrar la sección de encabezado si es el capítulo 1
			} else {
				introSection.style.display = 'none'; // Ocultar la sección de encabezado en los demás capítulos
			}
			
			// Actualiza los botones de navegación
			updateButtons();
			
			// Llama a la función para actualizar el resaltado del menú
			updateMenuHighlight();    
			
			// Desplazar hacia la parte superior de la pantalla
			window.scrollTo(0, 0);    

			// Actualiza la visibilidad de los iframes
			updateIframesVisibility();

			// Registra el cambio de lección en Google Analytics (mediante botonera o menú lateral)
			gtag('event', 'change_leccion', {
				'event_category': 'Navegación',                                    // Indica la categoría correspondiente al cambio de lección dentro de la formación
				'event_label': `${courseTitle} - Lección ${index + 1}`     // Registra como "Ver Lección 1", "Ver Lección 2", etc.
			});
		}

		function closeAllTranscriptions() {
			const contents = document.querySelectorAll('.transcripcion-content');
			const icons = document.querySelectorAll('.transcripcion-icon');

			contents.forEach(content => {
				content.style.display = 'none';
			});

			icons.forEach(icon => {
				icon.style.transform = 'rotate(0deg)';
			});
		}

		function updateButtons() {
			document.getElementById('prevBtn').disabled = currentIndex === 0;
			document.getElementById('nextBtn').disabled = currentIndex === capitulos.length - 1;
		}

		function updateMenuHighlight() {
			menuItems.forEach((item, i) => {
				if (i === currentIndex) {
					item.classList.add('active'); // Añade clase 'active' al elemento del menú actual
				} else {
					item.classList.remove('active'); // Elimina la clase 'active' de los demás elementos
				}
			});
		}

		// Eventos de los botones de navegación
		document.getElementById('nextBtn').addEventListener('click', function() {
			if (currentIndex < capitulos.length - 1) {
				currentIndex++;
				showCapitulo(currentIndex);
			}
		});

		document.getElementById('prevBtn').addEventListener('click', function() {
			if (currentIndex > 0) {
				currentIndex--;
				showCapitulo(currentIndex);
			}
		});

		// Muestra el primer capítulo al cargar la página
		showCapitulo(currentIndex);

		// Haz que showCapitulo esté disponible globalmente
		window.showCapitulo = showCapitulo;
	}
});


/*######################################################################################*/
/*				APERTURA Y CIERRE DE MENU LATERAL CONTENIDO FORMACION					*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', () => {
    // Buscar los elementos del menú
    const openMenuButton = document.getElementById('openMenuButton');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.side-menu ul li a'); // Selecciona las opciones del menú

    // Solo proceder si los elementos necesarios existen
    if (openMenuButton && sideMenu && overlay) {
        function abrirMenu() {
            sideMenu.style.width = "300px";
            sideMenu.querySelector('.menu-content').scrollTop = 0;
            document.body.style.overflow = 'hidden';  // Evita el scroll en el fondo
            overlay.style.display = 'block';          // Muestra la superposición (overlay)
        }

        function cerrarMenu() {
            sideMenu.style.width = "0px";
            document.body.style.overflow = '';         // Restaura el scroll
            overlay.style.display = 'none';            // Oculta la superposición (overlay)
        }

        openMenuButton.addEventListener('click', abrirMenu);  // Abrir menú al pulsar sobre botón de apertura

        overlay.addEventListener('click', cerrarMenu);        // Cierra menú al pulsar sobre superposición (overlay)

        // Solo añadir eventos a los ítems del menú si existen
        if (menuItems.length > 0) {
            // Añadir evento de clic a cada ítem del menú para cambiar el capítulo y cerrar el menú lateral
            menuItems.forEach((item, index) => {
                item.addEventListener('click', (event) => {
                    event.preventDefault(); // Previene la acción por defecto del enlace
                    if (window.showCapitulo) { // Asegúrate de que la función showCapitulo esté disponible
                        window.showCapitulo(index); // Cambia al capítulo correspondiente
                    }
                    cerrarMenu(); // Cierra el menú lateral
                });
            });
        }
    }
});

/*######################################################################################*/
/*		PERMITE DIRIGIRSE AL FOOTER AL PULSAR INFO EN MENU SUPERIOR DE FORMA SUAVE		*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            // Validar si href es un selector válido y no solo '#'
            if (href && href !== '#' && document.querySelector(href)) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function updateFooterLinks() {
        const legalNoteLink = document.getElementById('legal-note-link').querySelector('a');
        const privacyLink = document.getElementById('privacy-link').querySelector('a');

        if (window.innerWidth < 600) { // Ajusta el tamaño según tus necesidades
            legalNoteLink.textContent = 'Legal';
            privacyLink.textContent = 'Privacidad';
        } else {
            legalNoteLink.textContent = 'Nota Legal';
            privacyLink.textContent = 'Política de Privacidad';
        }
    }

    // Inicializa el contenido al cargar la página
    updateFooterLinks();

    // Actualiza el contenido al cambiar el tamaño de la pantalla
    window.addEventListener('resize', updateFooterLinks);
});