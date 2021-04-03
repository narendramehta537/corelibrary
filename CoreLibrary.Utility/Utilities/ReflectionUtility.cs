using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CoreLibrary.Utility.Utilities
{
    public class ReflectionUtility
    {
        public List<string> GetAllEntities<T>()
        {
            var names = AppDomain.CurrentDomain.GetAssemblies().SelectMany(x => x.GetTypes())
                 .Where(x => typeof(T).IsAssignableFrom(x) && !x.IsInterface && !x.IsAbstract)
                 .Select(x => x.Name).ToList();
            return names;
        }

       // public List<Type> Types<T>()
       // {
       ////     var types =
       ////container.GetTypesToRegister<IAnimal>(assemblies)
       ////.Concat(container.GetTypesToRegister<IDomesticAnimal>(assemblies))
       ////.Distinct();

       ////     container.Collection.Register<IAnimal>(
       ////         types.Where(typeof(IAnimal).IsAssignableFrom));
       ////     container.Collection.Register<IDomesticAnimal>(
       ////         types.Where(typeof(IDomesticAnimal).IsAssignableFrom));
       // }
    }
}
