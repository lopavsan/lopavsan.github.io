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
	const courseTitle = document.querySelector('.course-title').textContent.trim();
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
});


/*######################################################################################*/
/*	  NAVEGACION ENTRE CLASES (DESDE BOTONES ANTERIOR/POSTERIOR Y DEDE MENU LATERAL 	*/
/*######################################################################################*/
document.addEventListener("DOMContentLoaded", function() {
	const courseTitle = document.querySelector('.course-title').textContent.trim();
    const capitulos = document.querySelectorAll('.capitulo-container');
    const menuItems = document.querySelectorAll('.side-menu ul li a'); // Selecciona las opciones del menú
	const introSection = document.querySelector('.intro-section'); // Sección de encabezado que deseas mostrar/ocultar
    let currentIndex = 0;

    function showCapitulo(index) {
		// Cierra todas las transcripciones antes de cambiar de capítulo
        closeAllTranscriptions();
		
        // Pausar y reiniciar todos los videos antes de cambiar de sección
        resetAllMedia();

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
		
		// Registra el cambio de lección en Google Analytics (mediante botonera o menú lateral)
		gtag('event', 'change_leccion', {
			'event_category': 'Navegación',									// Indica la categoría correspondiente al cambio de lección dentro de la formación
			'event_label': `${courseTitle} - Lección ${index + 1}` 	// Registra como "Ver Lección 1", "Ver Lección 2", etc.
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

	function resetAllMedia() {
		// Detener y recargar todos los videos HTML5
		const videos = document.querySelectorAll('video');
		videos.forEach(video => {
			video.pause(); // Pausa el video
			video.currentTime = 0; // Lo lleva al inicio
			video.load(); // Vuelve a cargar el video para mostrar el poster
		});

		// Pausar todos los iframes de YouTube
		const iframes = document.querySelectorAll('iframe');
		iframes.forEach(iframe => {
			const src = iframe.src;
			if (src.includes("youtube.com")) {
				// Pausar video usando la API de YouTube (buscar en documentación otras "func" disponibles)
				//iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
				//iframe.contentWindow.postMessage('{"event":"command","func":"seekTo","args":["0", true]}', '*');
				iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

			} else {
				// Para otros iframes, usar el método de recarga
				iframe.src = '';
				iframe.src = src;
			}
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
});

/*######################################################################################*/
/*				APERTURA Y CIERRE DE MENU LATERAL CONTENIDO FORMACION					*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', () => {
    const openMenuButton = document.getElementById('openMenuButton');
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.side-menu ul li a'); // Selecciona las opciones del menú

    function abrirMenu() {
        sideMenu.style.width = "300px";
        sideMenu.querySelector('.menu-content').scrollTop = 0;
        document.body.style.overflow = 'hidden'; 	// Evita el scroll en el fondo
        overlay.style.display = 'block'; 			// Muestra la superposición (overlay)
    }

    function cerrarMenu() {
        sideMenu.style.width = "0px";
        document.body.style.overflow = ''; 			// Restaura el scroll
        overlay.style.display = 'none'; 			// Oculta la superposición (overlay)
    }

    openMenuButton.addEventListener('click', abrirMenu);	// Abrir menú al pulsar sobre botón de apertura

    overlay.addEventListener('click', cerrarMenu);			// Cierra menú al pulsar sobre superposición (overlay)

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
});

/*######################################################################################*/
/*		PERMITE DIRIGIRSE AL FOOTER AL PULSAR INFO EN MENU SUPERIOR DE FORMA SUAVE		*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

/*######################################################################################*/
/*				PASO VIDEO A PANTALLA COMPLETA AL GIRAR DISPOSITIVO MOVIL 				*/
/*######################################################################################*/
document.addEventListener('DOMContentLoaded', () => {
    // Función para entrar en pantalla completa
    function enterFullScreen(iframe) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Para Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Para Chrome, Safari y Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // Para IE/Edge
            iframe.msRequestFullscreen();
        }
    }

    // Función para salir de pantalla completa
    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Para Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Para Chrome, Safari y Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Para IE/Edge
            document.msExitFullscreen();
        }
    }

    // Detectar el iframe visible
    function getVisibleIframe() {
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            const style = window.getComputedStyle(iframe);
            if (style.display !== 'none' && style.visibility !== 'hidden' && iframe.offsetWidth > 0 && iframe.offsetHeight > 0) {
                return iframe;
            }
        }
        return null;
    }

    // Detectar cambios de orientación
    window.addEventListener("resize", () => {
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const visibleIframe = getVisibleIframe();

        if (visibleIframe) {
            if (isLandscape) {
                // Si está en modo horizontal, poner el iframe visible en pantalla completa
                enterFullScreen(visibleIframe);
            } else {
                // Si está en modo vertical, salir de pantalla completa
                exitFullScreen();
            }
        }
    });
});
