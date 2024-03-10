namespace ClientManager.Server.Options
{
    public class ApplicationSettings
    {
        public IReadOnlyList<string> ClientAppOrigins { get; init; } = new List<string>();
    }
}
