using DAL.DbContextClass;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly ApplicationContext _dbContext;
        private DbSet<T> table = null;

        public GenericRepository(ApplicationContext dbContext)
        {
            _dbContext = dbContext;
            table = dbContext.Set<T>();

        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            return await table.Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public IQueryable<T> GetAll()
        {
            IQueryable<T> set = table;
            return set;
        }

        public async Task AddAsync(T entity)
        {
            await table.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        public async Task Delete(object id)
        {
            T existing = table.Find(id);
            table.Remove(existing);
            _dbContext.SaveChangesAsync();
        }
        public async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }
        public void Save()
        {
            _dbContext.SaveChanges();
        }
        public async Task<IQueryable<T>> AsQueryable()
        {
            return await Task.Run(() =>
            {
                return _dbContext.Set<T>().AsQueryable().AsNoTracking();
            });
        }
        public async Task<IEnumerable<T>> Includes(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = table.Include(includes[0]);
            foreach (var include in includes.Skip(1))
            {
                query = query.Include(include);
            }
            return (IEnumerable<T>)query.ToListAsync();
        }

        public async Task<T> GetByIdAsync(Guid id, params Expression<Func<T, object>>[] includes)
        {
            var result = GetAll();
            if (includes.Any())
            {
                foreach (var include in includes)
                {
                    result = result.Include(include);
                }
            }
            return await result.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }
        public T GetFirstOrDefaultBy(Expression<Func<T, bool>> condition)
        {
            return _dbContext.Set<T>().Where(condition).FirstOrDefault(); ;
        }



        //private readonly ApplicationContext _context = null;

        //private DbSet<T> table = null;


        //public GenericProductRepo(ApplicationContext _context)
        //{
        //   _context = _context;
        //    table = _context.Set<T>();
        //}

        //public IQueryable<T> GetAll()
        //{
        //    return table;
        //}
        //public T GetById(object id)
        //{
        //    return table.Find(id);
        //}
        //public async void Insert(T obj)
        //{
        //    table.Add(obj);
        //}

        //public void Update(T obj)
        //{
        //    table.Attach(obj);
        //    _context.Entry(obj).State = EntityState.Modified;
        //}
        //public async void Delete(object id)
        //{
        //    T existing =  table.Find(id);
        //    table.Remove(existing);
        //}
        //public void Save()
        //{
        //    _context.SaveChanges();
        //}

        //public async Task<IEnumerable<T>> Includes(params Expression<Func<T, object>>[] includes)
        //{
        //    IQueryable<T> query = table.Include(includes[0]);
        //    foreach (var include in includes.Skip(1))
        //    {
        //        query = query.Include(include);
        //    }
        //    return (IEnumerable<T>)query.ToListAsync();
        //}

    }
}
