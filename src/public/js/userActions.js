async function deleteUser(userId) {
    try {
      console.log('Intentando eliminar usuario con ID:', userId);
      const url = `/api/users/${userId}`;
      console.log('URL de solicitud DELETE:', url);
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Usuario eliminado correctamente:', data.message);
        const userElement = document.getElementById(`user-${userId}`);
        if (userElement) {
          userElement.remove();
        } else {
          console.error('Elemento del usuario no encontrado en el DOM');
        }
      } else {
        console.error('Error al eliminar el usuario:', data.message);
        alert(`Error al eliminar el usuario: ${data.message}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error al intentar eliminar el usuario. Por favor, inténtalo de nuevo.');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-user-button');
    console.log('Botones de eliminar encontrados:', deleteButtons.length);
  
    deleteButtons.forEach(button => {
      console.log('Botón:', button.outerHTML);
      const userId = button.getAttribute('data-user-id');
      console.log('ID del usuario en el botón:', userId);
  
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const clickedButton = event.currentTarget;
        const clickedUserId = clickedButton.getAttribute('data-user-id');
        console.log('Botón clickeado:', clickedButton.outerHTML);
        console.log('ID del usuario desde el botón clickeado:', clickedUserId);
        
        if (clickedUserId) {
          if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            deleteUser(clickedUserId);
          }
        } else {
          console.error('ID del usuario no encontrado en el botón clickeado');
          alert('Error: ID del usuario no encontrado');
        }
      });
    });
  });