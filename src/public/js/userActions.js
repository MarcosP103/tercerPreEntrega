async function deleteUser(uid) {
    try {
      console.log('Intentando eliminar usuario con ID:', uid);
      const url = `/api/users/${uid}`;
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Usuario eliminado correctamente:', data.message);
        const userElement = document.getElementById(`user-${uid}`);
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
  
    deleteButtons.forEach(button => {
      const userId = button.getAttribute('data-user-id');


  
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const clickedButton = event.currentTarget;
        const clickedUserId = clickedButton.getAttribute('data-user-id');
        
        if (clickedUserId) {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¡No podrás recuperar este usuario después de eliminarlo!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminarlo!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteUser(clickedUserId);
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error: ID del usuario no encontrado'
                });
            }
        });
    });
});

  //Cambio rol
  document.addEventListener('DOMContentLoaded', () => {
    const changeRoleButtons = document.querySelectorAll('.change-role-button');
  
    changeRoleButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const userId = button.getAttribute('data-user-id');
        const currentRole = button.getAttribute('data-current-role');

        const newRole = currentRole === 'user' ? 'premium' : 'user';
  
        try {
          const response = await fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
          });
  
          if (response.ok) {
            alert('Rol actualizado correctamente');
            location.reload();
          } else {
            alert('Error al cambiar el rol');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error al cambiar el rol');
        }
      });
    });
  });
  