using ClientManager.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ClientManager.Server.Repositories
{
    public class ClientRepository
    {
        private readonly DatabaseContext _context;

        public ClientRepository(DatabaseContext context)
        {
            _context = context;
        }

        public IEnumerable<Client> GetAllClients()
        {
            return _context.Clients.ToList();
        }

        public Client? DeleteClient(int clientId)
        {
            var clientToDelete = _context.Clients.FirstOrDefault(c => c.ClientId == clientId);
            if (clientToDelete != null)
            {
                _context.Clients.Remove(clientToDelete);
                _context.SaveChanges();
            }
            return clientToDelete;
        }

        public Client UpdateClient(Client client)
        {
            _context.Clients.Attach(client);
            _context.Entry(client).State = EntityState.Modified;
            _context.SaveChanges();
            return client;
        }

        public Client AddClient(Client client)
        {
            _context.Clients.Add(client);
            _context.SaveChanges();
            return client;
        }
    }
}
