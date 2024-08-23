/*######################################################################################*/
/*						DESPLIEGUE Y COLAPSO DE TEXTO TRANSCRIPCION						*/
/*######################################################################################*/
/* Esta sección de código funciona con todas las instancias del controlador de tipo transcripcion-header */
document.addEventListener("DOMContentLoaded", function() {
    const headers = document.querySelectorAll('.transcripcion-header');
	
    headers.forEach(header => {
        const icon = header.querySelector('.transcripcion-icon');
        const content = header.nextElementSibling;

        header.addEventListener('click', function() {
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
            icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
        });
    });
});

/*######################################################################################*/
/*	  NAVEGACION ENTRE CLASES (DESDE BOTONES ANTERIOR/POSTERIOR Y DEDE MENU LATERAL 	*/
/*######################################################################################*/
document.addEventListener("DOMContentLoaded", function() {
    const capitulos = document.querySelectorAll('.capitulo-container');
    const menuItems = document.querySelectorAll('.side-menu ul li a'); // Selecciona las opciones del menú
    let currentIndex = 0;

    function showCapitulo(index) {
        // Pausar y reiniciar todos los videos antes de cambiar de sección
        resetAllMedia();

        currentIndex = index;
        capitulos.forEach((capitulo, i) => {
            capitulo.style.display = i === index ? 'flex' : 'none';
        });
        updateButtons();
        updateMenuHighlight(); // Llama a la función para actualizar el resaltado del menú
    }

	function resetAllMedia() {
		// Detener y recargar todos los videos HTML5
		const videos = document.querySelectorAll('video');
		videos.forEach(video => {
			video.pause(); // Pausa el video
			video.currentTime = 0; // Lo lleva al inicio
			video.load(); // Vuelve a cargar el video para mostrar el poster
		});

		// Detener y recargar todos los iframes de YouTube y Vimeo
		const iframes = document.querySelectorAll('iframe');
		iframes.forEach(iframe => {
			const src = iframe.src; // Guarda la URL actual del iframe
			iframe.src = ''; // Borra temporalmente la URL para detener el video
			iframe.src = src; // Restablece la URL para recargar el video desde el inicio
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
    const closeMenuButton = document.getElementById('closeMenuButton');
    const sideMenu = document.getElementById('sideMenu');

    openMenuButton.addEventListener('click', () => {
        sideMenu.style.width = "300px";
		sideMenu.querySelector('.menu-content').scrollTop = 0;
    });

    closeMenuButton.addEventListener('click', () => {
        sideMenu.style.width = "0px";
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
