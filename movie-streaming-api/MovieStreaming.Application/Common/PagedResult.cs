namespace MovieStreaming.Application.Common
{
	public class PagedResult<T>
	{
		public IEnumerable<T> Items { get; set; } = new List<T>();
		public int PageNumber { get; set; }
		public int PageSize { get; set; }
		public int TotalRecords { get; set; }
		public int TotalPages => (int)Math.Ceiling((double)TotalRecords / PageSize);

		public PagedResult(IEnumerable<T> items, int pageNumber, int pageSize, int totalRecords)
		{
			Items = items;
			PageNumber = pageNumber;
			PageSize = pageSize;
			TotalRecords = totalRecords;
		}
	}
}
