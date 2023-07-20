using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        //    IQueryable<T> GetAll();
        //    T GetById(object id);
        //    void Insert(T obj);
        //    void Update(T obj);
        //    void Delete(object id);
        //    void Save();
        //    Task<IEnumerable<T>> Includes(params Expression<Func<T, object>>[] includes);
        Task AddAsync(T entity);
        Task<T> GetByIdAsync(Guid id);
        Task UpdateAsync(T entity);
        Task Delete(object id);
        Task DeleteAsync(T entity);
        void Save();
        IQueryable<T> GetAll();
        Task<IQueryable<T>> AsQueryable();
        Task<IEnumerable<T>> Includes(params Expression<Func<T, object>>[] includes);
        Task<T> GetByIdAsync(Guid id, params Expression<Func<T, object>>[] includes);
        T GetFirstOrDefaultBy(Expression<Func<T, bool>> condition);
    }
}
