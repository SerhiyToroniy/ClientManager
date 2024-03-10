using ClientManager.Server.Models;
using ClientManager.Server.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ClientManager.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ClientRepository _repository;

        public ClientController(ClientRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("getAll")]
        public IActionResult GetAllClients()
        {
            var clients = _repository.GetAllClients();
            return Ok(clients);
        }

        [HttpDelete("delete/{clientId}")]
        public IActionResult DeleteClient(int clientId)
        {
            var deletedClient = _repository.DeleteClient(clientId);
            if (deletedClient == null)
            {
                return NotFound();
            }
            return Ok(deletedClient);
        }

        [HttpPut("update")]
        public IActionResult UpdateClient([FromBody] Client client)
        {
            try
            {
                var updatedClient = _repository.UpdateClient(client);
                if (updatedClient == null)
                {
                    return NotFound();
                }
                return Ok(updatedClient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating client: {ex.Message}");
            }
        }

        [HttpPost("add")]
        public IActionResult AddClient([FromBody] Client client)
        {
            try
            {
                var addedClient = _repository.AddClient(client);
                return CreatedAtAction(nameof(GetAllClients), addedClient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while adding client: {ex.Message}");
            }
        }
    }
}
