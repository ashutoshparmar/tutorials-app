const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../UI/public/data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Helper to generate a beautiful, responsive HTML template for detailed views
function generateHtml(courseName, topicTitle, description, concepts, codeExample, pitfalls) {
  const conceptsHtml = concepts.map(c => `<li><strong>${c.title}:</strong> ${c.text}</li>`).join('\n');
  return `
<div class="detailed-container" style="padding: 24px; color: var(--text-primary); font-family: var(--font-family);">
  <h1 style="font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px;">${topicTitle}</h1>
  <p style="font-size: 0.85rem; font-weight: 600; text-transform: uppercase; color: var(--brand-primary); letter-spacing: 0.05em; margin-bottom: 24px;">Course: ${courseName}</p>
  
  <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 24px;">
    ${description}
  </div>

  <div class="highlight-box" style="background-color: var(--bg-tertiary); border-left: 4px solid var(--brand-primary); border-radius: 8px; padding: 16px; margin-bottom: 28px;">
    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">💡 Key Concepts</h3>
    <ul style="margin-left: 20px; color: var(--text-secondary); line-height: 1.7;">
      ${conceptsHtml}
    </ul>
  </div>

  ${codeExample ? `
  <div style="margin-bottom: 28px;">
    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">💻 Practical Code Example</h3>
    <div style="border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); background-color: #1e293b;">
      <div style="background-color: #0f172a; color: #94a3b8; font-size: 0.7rem; font-weight: 700; padding: 6px 12px; border-bottom: 1px solid #1e293b; letter-spacing: 0.05em;">C# / CODE BLOCK</div>
      <pre style="padding: 16px; overflow-x: auto; margin: 0;"><code style="color: #f1f5f9; font-family: Consolas, monospace; font-size: 0.9rem; line-height: 1.6;">${codeExample.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
  </div>
  ` : ''}

  <div class="alert-box" style="background-color: rgba(239, 68, 68, 0.08); border-left: 4px solid var(--brand-danger); border-radius: 8px; padding: 16px; margin-top: 24px;">
    <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--brand-danger); margin-bottom: 8px;">⚠️ Common Pitfalls & Mistakes</h3>
    <p style="color: var(--text-secondary); line-height: 1.6; margin: 0;">
      ${pitfalls}
    </p>
  </div>
</div>
  `.trim();
}

// Full curriculum data model configuration
const curriculum = {
  'c#': {
    name: 'C# Programming',
    topics: [
      {
        id: 'cs-intro-runtime',
        title: 'Intro to C# & .NET Runtime',
        desc: 'C# is a modern, type-safe, object-oriented programming language that compiles to Intermediate Language (IL). The .NET Runtime (CLR) compiles this IL into native machine code and manages execution.',
        concepts: [
          { title: 'Common Language Runtime (CLR)', text: 'The engine that runs managed code, handling memory, garbage collection, and type safety.' },
          { title: 'Intermediate Language (IL)', text: 'C# source code is compiled into IL, which is CPU-independent bytecode.' },
          { title: 'Common Type System (CTS)', text: 'Defines how types are declared, used, and managed in the .NET runtime to allow cross-language integration.' }
        ],
        code: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("C# Code running under Common Language Runtime (CLR)!");\n    }\n}',
        pitfalls: 'Confusing C# language features (like switch expressions) with .NET runtime capabilities. Runtimes execute assembly binaries, while C# compilers translate syntax.',
        questions: [
          { id: 'cs-intro-q1', question: 'What is the CLR in .NET?', answer: 'The Common Language Runtime is the execution engine that loads, validates, compiles (via JIT), and manages memory for .NET assemblies.' },
          { id: 'cs-intro-q2', question: 'What is JIT compilation?', answer: 'Just-In-Time compilation converts IL (Intermediate Language) bytecode into native machine-readable instructions at runtime.' }
        ]
      },
      {
        id: 'cs-variables-nullables',
        title: 'Variables, Data Types & Nullables',
        desc: 'Variables hold values of specific types. Nullable types allow value types (like int, bool) to be assigned a value of null, which is useful when working with databases.',
        concepts: [
          { title: 'Value Types', text: 'Primitives (int, double) and structs stored on the stack containing actual data.' },
          { title: 'Nullable Types (T?)', text: 'Wrappers that allow assigning null to value types using Nullable<T>.' },
          { title: 'Null Coalescing (??)', text: 'Operator used to define a default value if a variable evaluates to null.' }
        ],
        code: 'int? count = null;\nint actualCount = count ?? 0; // fallback to 0\nConsole.WriteLine($"Count: {actualCount}");',
        pitfalls: 'Accessing a nullable variable\'s Value property directly (e.g. nullable.Value) when it is null. This throws an InvalidOperationException. Always check HasValue first or use HasValue/Value pattern.',
        questions: [
          { id: 'cs-var-q1', question: 'What are Nullable Types in C#?', answer: 'Nullable types are instances of System.Nullable<T> struct, allowing value types to represent an undefined or null state.' },
          { id: 'cs-var-q2', question: 'What is the difference between null-coalescing (??) and null-conditional (?.) operators?', answer: '?? returns the right operand if the left is null, while ?. short-circuits member access, returning null if the parent reference is null.' }
        ]
      },
      {
        id: 'cs-val-ref',
        title: 'Value Types vs Reference Types',
        desc: 'C# partitions types into Value Types (stored on the Stack, copied by value) and Reference Types (stored on the Heap, copied by reference pointer).',
        concepts: [
          { title: 'Stack Memory', text: 'Fast, automatic, and small memory used for local execution frames and value types.' },
          { title: 'Heap Memory', text: 'Large, managed storage where objects (reference types) are allocated and reclaimed by Garbage Collection.' },
          { title: 'Boxing & Unboxing', text: 'The CPU overhead of wrapping value types into heap-allocated object wrappers.' }
        ],
        code: 'struct MyStruct { public int X; } // Value type\nclass MyClass { public int X; } // Reference type\n\nMyStruct s1 = new MyStruct() { X = 5 };\nMyStruct s2 = s1; s2.X = 10; // s1.X remains 5\n\nMyClass c1 = new MyClass() { X = 5 };\nMyClass c2 = c1; c2.X = 10; // c1.X changes to 10!',
        pitfalls: 'Implicit boxing of value types inside collections (e.g. ArrayList), which creates unnecessary heap allocations and triggers heavy garbage collections.',
        questions: [
          { id: 'cs-valref-q1', question: 'What is boxing and unboxing?', answer: 'Boxing is converting a value type to a reference type (heap allocation). Unboxing is casting it back (stack conversion).' },
          { id: 'cs-valref-q2', question: 'Are structs always allocated on the Stack?', answer: 'No, structs are stored inline within their container. If a struct is a field inside a class, it is stored on the heap as part of that class instance.' }
        ]
      },
      {
        id: 'cs-control-flow',
        title: 'Control Flow & Loops',
        desc: 'Control flow manages conditional execution and iteration using blocks like if-else, switch, for, foreach, and while.',
        concepts: [
          { title: 'Conditional statements', text: 'Directing path execution using if-else structures or pattern-matching switch blocks.' },
          { title: 'Foreach Iteration', text: 'Looping over collections that implement the IEnumerable interface.' },
          { title: 'Break & Continue', text: 'Controlling loop exits or skipping to the next loop cycle.' }
        ],
        code: 'var names = new List<string> { "Alice", "Bob", "Charlie" };\nforeach (var name in names) {\n    if (name.StartsWith("B")) continue; // skip Bob\n    Console.WriteLine(name);\n}',
        pitfalls: 'Modifying a collection inside a foreach loop. This invalidates the collection\'s enumerator, causing an InvalidOperationException at runtime.',
        questions: [
          { id: 'cs-flow-q1', question: 'Why does modifying a collection during foreach throw an error?', answer: 'The IEnumerator tracks state changes. If you call Add or Remove, the collection version changes, and the iterator throws InvalidOperationException to protect integrity.' },
          { id: 'cs-flow-q2', question: 'When is a while loop preferred over a for loop?', answer: 'When the number of iterations is not known in advance and depends on a condition being met during execution.' }
        ]
      },
      {
        id: 'cs-classes-structs-records',
        title: 'Classes, Structs, and Records',
        desc: 'C# offers three main ways to define data blueprints. Classes support full inheritance, Structs are lightweight value types, and Records provide value-based equality out-of-the-box (ideal for immutable data models).',
        concepts: [
          { title: 'Classes', text: 'Mutable reference types that support OOP hierarchies.' },
          { title: 'Structs', text: 'Lightweight value types that avoid heap allocation overhead.' },
          { title: 'Records', text: 'Types with built-in value-equality, formatting, and the "with" expression for non-destructive mutation.' }
        ],
        code: 'public record User(string Name, string Role); // Immutable Record\nvar u1 = new User("Ashutosh", "Admin");\nvar u2 = u1 with { Role = "User" }; // Non-destructive mutation',
        pitfalls: 'Declaring large structs (more than 16 bytes). Because structs are value types, they are copied by copying all data bytes. Passing large structs around causes high memory copy overhead.',
        questions: [
          { id: 'cs-types-q1', question: 'What is a Record in C#?', answer: 'A Record is a class or struct that provides built-in value equality, standard string formatting, and support for non-destructive mutations via with expressions.' },
          { id: 'cs-types-q2', question: 'When should you use a struct over a class?', answer: 'Use structs for small, short-lived, immutable data objects (like points or coordinates) that are less than 16 bytes.' }
        ]
      },
      {
        id: 'cs-properties-indexers',
        title: 'Properties & Indexers',
        desc: 'Properties expose private variables safely, while indexers allow objects to be queried using bracket notation, mimicking array indices.',
        concepts: [
          { title: 'Auto-Implemented Properties', text: 'Direct properties where the compiler manages the backing private variable.' },
          { title: 'Expression-Bodied Members', text: 'Compact property definitions using lambda expressions.' },
          { title: 'Indexers', text: 'Declared using the "this" keyword, indexers allow custom array-like routing lookup.' }
        ],
        code: 'public class CourseCatalog {\n    private string[] courses = { "C#", "SQL", "Docker" };\n    public string this[int index] { // Indexer\n        get => courses[index];\n        set => courses[index] = value;\n    }\n}',
        pitfalls: 'Creating infinite recursion loops in properties by returning the property itself instead of the backing field inside the custom get accessor.',
        questions: [
          { id: 'cs-prop-q1', question: 'What is an Indexer in C#?', answer: 'An indexer is a member that enables instances of a class or struct to be indexed in the same way as arrays using brackets.' },
          { id: 'cs-prop-q2', question: 'What is the init keyword in C# properties?', answer: 'The init keyword restricts property assignment to object initialization blocks, enforcing immutability thereafter.' }
        ]
      },
      {
        id: 'cs-oop-principles',
        title: 'OOP Principles in C#',
        desc: 'C# fully implements Encapsulation, Abstraction, Inheritance, and Polymorphism to model real-world domains.',
        concepts: [
          { title: 'Encapsulation', text: 'Restricting access to internal structures using keywords like private and internal.' },
          { title: 'Inheritance', text: 'Reusing class structures via class base inheritance (:).' },
          { title: 'Polymorphism', text: 'Declaring virtual methods in base classes and overriding them in subclasses.' }
        ],
        code: 'public class Animal {\n    public virtual void MakeSound() => Console.WriteLine("Generic Sound");\n}\npublic class Cat : Animal {\n    public override void MakeSound() => Console.WriteLine("Meow");\n}',
        pitfalls: 'Deep inheritance chains that violate Liskov Substitution, coupling child classes tightly to base class implementations.',
        questions: [
          { id: 'cs-oop-q1', question: 'What is polymorphic method overriding?', answer: 'Method overriding allows a derived class to provide a specific implementation of a virtual or abstract method defined in a base class.' },
          { id: 'cs-oop-q2', question: 'How is abstraction implemented in C#?', answer: 'Through abstract classes and interface declarations, defining structural contracts without forcing implementation detail.' }
        ]
      },
      {
        id: 'cs-interfaces-abstract',
        title: 'Interfaces & Abstract Classes',
        desc: 'Interfaces define contracts that classes must implement. Abstract classes are partial implementations that cannot be instantiated on their own.',
        concepts: [
          { title: 'Interfaces', text: 'Contracts declaring methods and properties. Classes can implement multiple interfaces.' },
          { title: 'Abstract Classes', text: 'Base classes that can contain implemented methods, backing fields, and state.' },
          { title: 'Default Interface Implementations', text: 'C# 8+ feature allowing interfaces to define default method blocks.' }
        ],
        code: 'public interface ILogger { void Log(string msg); }\npublic abstract class BaseService {\n    public abstract void Process();\n    public void LogStart() => Console.WriteLine("Processing start...");\n}',
        pitfalls: 'Adding new methods to public interfaces without default implementations, which breaks all classes implementing that interface in external libraries.',
        questions: [
          { id: 'cs-inter-q1', question: 'Can a class inherit from multiple abstract classes?', answer: 'No, C# supports single class inheritance. However, a class can implement multiple interfaces.' },
          { id: 'cs-inter-q2', question: 'What is the main difference between abstract class and interface?', answer: 'Abstract classes can hold state (backing fields) and constructors, whereas interfaces cannot hold instance fields and primarily define behavior contracts.' }
        ]
      },
      {
        id: 'cs-generics-collections',
        title: 'Generics & Collections',
        desc: 'Generics allow classes, methods, and interfaces to be defined with placeholder types, improving code reuse, type safety, and runtime performance.',
        concepts: [
          { title: 'Generic Constraints', text: 'Limiting types with keywords (where T : class, where T : new()).' },
          { title: 'Generic Collections', text: 'Types like List<T> and Dictionary<TKey, TValue>.' },
          { title: 'Performance', text: 'Avoiding boxing/unboxing overhead when working with value types.' }
        ],
        code: 'public class Repository<T> where T : class {\n    private List<T> items = new List<T>();\n    public void Add(T item) => items.Add(item);\n}',
        pitfalls: 'Overusing generic type parameters without constraints, making the inside code compile-errors because the compiler doesn\'t know what actions the type supports.',
        questions: [
          { id: 'cs-gen-q1', question: 'Why are generic collections preferred over non-generic ones?', answer: 'They provide compile-time type safety and eliminate boxing/unboxing performance overhead for value types.' },
          { id: 'cs-gen-q2', question: 'What does the constraint where T : new() mean?', answer: 'It specifies that the generic type parameter T must have a public parameterless constructor, allowing instantiation (new T()) inside the class.' }
        ]
      },
      {
        id: 'cs-exception-handling',
        title: 'Exception Handling',
        desc: 'Exception handling intercepts runtime anomalies using try, catch, finally, and custom exception types.',
        concepts: [
          { title: 'Try-Catch blocks', text: 'Surrounding fragile actions and catching specific exceptions (e.g. SqlException).' },
          { title: 'Finally block', text: 'Ensuring execution occurs (like closing connections) regardless of exceptions.' },
          { title: 'Throw expressions', text: 'Throwing custom exceptions inline.' }
        ],
        code: 'try {\n    int zero = 0; int x = 10 / zero;\n} catch (DivideByZeroException ex) {\n    Console.WriteLine($"Error caught: {ex.Message}");\n} finally {\n    Console.WriteLine("Cleanup completed.");\n}',
        pitfalls: 'Catching the base System.Exception and swallowing it, or rethrowing with "throw ex;" which wipes out the original stack trace instead of using "throw;".',
        questions: [
          { id: 'cs-exc-q1', question: 'What is the difference between "throw ex" and "throw"?', answer: '"throw ex" resets the stack trace to the current catch block, losing history. "throw" preserves the entire original stack trace.' },
          { id: 'cs-exc-q2', question: 'When should a custom exception be created?', answer: 'Create custom exceptions when handling domain-specific errors that require custom data or actions not described by system exceptions.' }
        ]
      },
      {
        id: 'cs-delegates-events-lambdas',
        title: 'Delegates, Events & Lambdas',
        desc: 'Delegates are type-safe function pointers. Events implement a publish-subscribe model, and Lambdas provide clean, inline anonymous functions.',
        concepts: [
          { title: 'Delegates', text: 'Declaring signature layouts like Action<T> and Func<T, TResult>.' },
          { title: 'Events', text: 'Encapsulated delegates that prevent external triggers and support += subscriptions.' },
          { title: 'Lambda Expressions', text: 'Syntax (input => expression) representing inline function definitions.' }
        ],
        code: 'public class Publisher {\n    public event Action OnChanged; // Event definition\n    public void Notify() => OnChanged?.Invoke();\n}\n\nPublisher p = new Publisher();\np.OnChanged += () => Console.WriteLine("Notified!");',
        pitfalls: 'Leaking memory by subscribing to events but never unsubscribing. This prevents the garbage collector from reclaiming the subscribing object.',
        questions: [
          { id: 'cs-event-q1', question: 'What is a delegate?', answer: 'A delegate is a reference type that defines a method signature, allowing methods to be passed as arguments.' },
          { id: 'cs-event-q2', question: 'How do you prevent memory leaks when using events?', answer: 'Ensure you unsubscribe from the event using the -= operator when the subscriber is being disposed.' }
        ]
      },
      {
        id: 'cs-linq-basics',
        title: 'LINQ Basics in C#',
        desc: 'Language Integrated Query (LINQ) provides a SQL-like interface to query collections, XML, and database frameworks.',
        concepts: [
          { title: 'Extension Methods', text: 'LINQ relies on extending IEnumerable with custom query operations.' },
          { title: 'Query Syntax', text: 'Declarative queries (from x in source select x).' },
          { title: 'Method Syntax', text: 'Functional queries using lambda expressions (source.Select(x => x)).' }
        ],
        code: 'int[] scores = { 90, 71, 82 };\nvar highScores = scores.Where(s => s > 80).OrderBy(s => s);\nforeach (var s in highScores) Console.WriteLine(s);',
        pitfalls: 'Not understanding deferred execution, leading to queries running repeatedly when iterated in loops.',
        questions: [
          { id: 'cs-linq-q1', question: 'What is the main difference between Query and Method syntax?', answer: 'Query syntax is structured like SQL. Method syntax uses extension methods and lambdas, supporting more operators.' },
          { id: 'cs-linq-q2', question: 'What is the purpose of deferred execution in LINQ?', answer: 'It evaluates queries only when the data is read (e.g. in a foreach loop), optimizing database load.' }
        ]
      },
      {
        id: 'cs-async-await',
        title: 'Asynchronous Programming (async/await)',
        desc: 'Asynchronous programming uses async, await, and Task objects to run tasks without blocking the main CPU threads.',
        concepts: [
          { title: 'Task & Task<T>', text: 'Represent ongoing execution models that return data in the future.' },
          { title: 'Await Keyword', text: 'Non-blocking wait that releases the current thread until the task is complete.' },
          { title: 'Task.ConfigureAwait', text: 'Controlling synchronization contexts for background thread returns.' }
        ],
        code: 'public async Task<string> DownloadWebPageAsync(string url) {\n    using HttpClient client = new HttpClient();\n    return await client.GetStringAsync(url); // Non-blocking\n}',
        pitfalls: 'Using async void instead of async Task for methods that do not return values (except for event handlers), making exception catching impossible.',
        questions: [
          { id: 'cs-async-q1', question: 'Why is "async void" discouraged?', answer: 'Exceptions thrown in async void methods cannot be caught by callers and can crash the application process.' },
          { id: 'cs-async-q2', question: 'What is the difference between Task and ValueTask?', answer: 'ValueTask is a struct that prevents heap allocation when the async method completes synchronously.' }
        ]
      },
      {
        id: 'cs-file-io',
        title: 'File I/O & Serialization',
        desc: 'File I/O accesses local disk volumes, while serialization translates memory objects into data streams like JSON or XML.',
        concepts: [
          { title: 'Streams', text: 'Reading and writing binary or text streams (StreamReader, FileStream).' },
          { title: 'JSON Serialization', text: 'Converting C# objects into JSON strings using System.Text.Json.' },
          { title: 'Using Statements', text: 'Ensuring file locks and buffers are closed automatically.' }
        ],
        code: 'using System.IO;\nusing System.Text.Json;\n\nvar user = new { Name = "Ashutosh" };\nstring json = JsonSerializer.Serialize(user);\nFile.WriteAllText("user.json", json);',
        pitfalls: 'Forgetting to close or dispose file streams, which leaves locks on the filesystem and causes subsequent operations to fail.',
        questions: [
          { id: 'cs-file-q1', question: 'What does the using statement do for streams?', answer: 'It ensures the Stream calls Dispose(), releasing operating system file locks immediately.' },
          { id: 'cs-file-q2', question: 'Which namespace handles modern C# JSON serialization?', answer: 'System.Text.Json, which is optimized for high-performance and low-memory operations.' }
        ]
      },
      {
        id: 'cs-memory-gc',
        title: 'Memory Management & GC',
        desc: 'The Garbage Collector (GC) manages allocation and reclamation of heap memory for managed code.',
        concepts: [
          { title: 'GC Generations', text: 'Allocations are sorted into Gen 0 (short-lived), Gen 1 (buffer), and Gen 2 (long-lived).' },
          { title: 'IDisposable', text: 'Interface declaring Dispose() to release unmanaged objects (files, sockets).' },
          { title: 'Finalizers', text: 'Fallback methods (~Class) to clean up resources during garbage collection.' }
        ],
        code: 'public class DatabaseConnector : IDisposable {\n    private SqlConnection conn = new SqlConnection();\n    public void Dispose() {\n        conn.Dispose(); // Release database socket resource\n    }\n}',
        pitfalls: 'Calling GC.Collect() manually in code. This triggers full heap evaluations and degrades runtime performance.',
        questions: [
          { id: 'cs-mem-q1', question: 'How do GC generations optimize memory management?', answer: 'By collecting Gen 0 frequently (where short-lived objects live), avoiding expensive full-heap Gen 2 scans.' },
          { id: 'cs-mem-q2', question: 'When should a class implement IDisposable?', answer: 'When it holds references to unmanaged resources like files, database connections, or network sockets.' }
        ]
      },
      {
        id: 'cs-pattern-matching-switch',
        title: 'Pattern Matching & Switch Expressions',
        desc: 'Inspect type shapes, properties, and values in a single expression using modern pattern matching features.',
        concepts: [
          { title: 'Type Patterns', text: 'Checking types and declaring local references inline (is Customer c).' },
          { title: 'Property Patterns', text: 'Filtering inside switch constructs by property matches ({ Age: > 18 }).' },
          { title: 'Switch Expressions', text: 'Expression-oriented switch syntax using lambda-like mapping (=>).' }
        ],
        code: 'public string GetTicketPrice(User u) => u switch {\n    { Role: "Admin" } => "Free",\n    { Age: < 12 } => "$5",\n    _ => "$10" // Default case\n};',
        pitfalls: 'Creating overlapping switch patterns where a general case catches values before a specific case checks them.',
        questions: [
          { id: 'cs-match-q1', question: 'What is the default case in switch expressions?', answer: 'The discard operator (_) matches any input that did not match previous cases.' },
          { id: 'cs-match-q2', question: 'What is a property pattern?', answer: 'It checks if properties of an object match specified conditions, evaluating properties inline.' }
        ]
      },
      {
        id: 'cs-attributes-reflection',
        title: 'Attributes & Reflection',
        desc: 'Reflection allows code metadata inspection and dynamic invocation of objects at runtime.',
        concepts: [
          { title: 'Attributes', text: 'Adding metadata tags to classes, fields, or parameters ([Serializable]).' },
          { title: 'Type Class', text: 'Using typeof() or GetType() to fetch metadata reflection properties.' },
          { title: 'Dynamic Instantiation', text: 'Creating instances dynamically using Activator.CreateInstance.' }
        ],
        code: 'var type = typeof(string);\nvar methods = type.GetMethods();\nConsole.WriteLine($"String class has {methods.Length} methods.");',
        pitfalls: 'Using reflection in hot paths (frequently called loops). Reflection lookup is slow and degrades performance.',
        questions: [
          { id: 'cs-refl-q1', question: 'What is Reflection in C#?', answer: 'Reflection provides metadata descriptions of classes, assemblies, and modules, allowing dynamic object creation.' },
          { id: 'cs-refl-q2', question: 'Why is Reflection slower than static calls?', answer: 'Because it involves runtime metadata table searches, type resolving, and string matching instead of compile-time calls.' }
        ]
      },
      {
        id: 'cs-multithreading-parallel',
        title: 'Multithreading & Parallel Programming',
        desc: 'Run concurrent CPU operations using Thread, ThreadPool, Task Parallel Library (TPL), and Parallel.ForEach.',
        concepts: [
          { title: 'Thread vs Task', text: 'Threads are operating system constructs. Tasks are managed models representing execution units.' },
          { title: 'Lock & Thread Safety', text: 'Preventing race conditions using the lock keyword on private objects.' },
          { title: 'Parallel.ForEach', text: 'Splitting loop operations across multiple CPU cores automatically.' }
        ],
        code: 'private static object _lock = new object();\nprivate static int _count = 0;\n\npublic void Increment() {\n    lock (_lock) {\n        _count++; // Thread safe\n    }\n}',
        pitfalls: 'Deadlocks, which happen when Thread A locks Resource X and waits for Resource Y, while Thread B locks Y and waits for X.',
        questions: [
          { id: 'cs-thread-q1', question: 'What is a deadlock and how do you prevent it?', answer: 'A deadlock occurs when threads block each other waiting for resources. Prevent it by locking resources in a consistent order and using timeouts.' },
          { id: 'cs-thread-q2', question: 'What is the Task Parallel Library (TPL)?', answer: 'A set of APIs that simplify adding parallelism and concurrency by scheduling tasks across threads.' }
        ]
      },
      {
        id: 'cs-modern-features',
        title: 'C# Modern Features (C# 10-13)',
        desc: 'Explore new compiler additions including primary constructors, global using statements, file-scoped namespaces, and collection expressions.',
        concepts: [
          { title: 'Primary Constructors', text: 'Declaring constructor parameters inline on class definitions.' },
          { title: 'File-Scoped Namespaces', text: 'Reducing bracket nesting by ending namespace declarations with a semicolon.' },
          { title: 'Collection Expressions', text: 'Using bracket syntax ([1, 2, 3]) to define collections.' }
        ],
        code: 'namespace MyNamespace; // File-scoped namespace\n\npublic class Person(string name) { // Primary Constructor\n    public string Name { get; } = name;\n}',
        pitfalls: 'Using primary constructors on mutable classes where parameters shadow properties, causing naming confusion.',
        questions: [
          { id: 'cs-modern-q1', question: 'What are primary constructors?', answer: 'A C# feature allowing class constructor parameters to be defined directly on the class header, scope-accessible throughout the class body.' },
          { id: 'cs-modern-q2', question: 'What are file-scoped namespaces?', answer: 'A declaration ending with a semicolon (namespace X;) that applies to the entire file, reducing bracket indent level.' }
        ]
      }
    ]
  },
  'oop': {
    name: 'Object-Oriented Programming',
    topics: [
      {
        id: 'oop-procedural-vs-oop',
        title: 'Procedural vs Object-Oriented Programming',
        desc: 'Understand the shift from action-based programming (functions operating on data) to object-based programming (entities bundling state and behavior together).',
        concepts: [
          { title: 'Procedural Paradigm', text: 'Programs organized as sequential steps, functions, and global variables.' },
          { title: 'Object-Oriented Paradigm', text: 'Programs organized as objects containing fields (data) and methods (logic).' },
          { title: 'Maintainability', text: 'OOP limits the side effects of changing state by encapsulating data inside objects.' }
        ],
        code: '// Procedural approach\ndouble balance = 100.0;\ndouble Withdraw(double b, double a) => b - a;\n\n// OOP approach\npublic class Account {\n    private double balance = 100.0;\n    public void Withdraw(double a) => balance -= a;\n}',
        pitfalls: 'Writing "Anemic Domain Models" (objects with only properties and no behavior), which is just procedural code using classes as data bags.',
        questions: [
          { id: 'oop-proc-q1', question: 'What is the main difference between procedural and OOP paradigms?', answer: 'Procedural code separates functions from data. OOP bundles data and functions into self-contained objects.' },
          { id: 'oop-proc-q2', question: 'What is an anemic domain model?', answer: 'A model containing classes with state (properties) but no behavior (methods), separating data from logic.' }
        ]
      },
      {
        id: 'oop-classes-objects',
        title: 'Classes and Objects',
        desc: 'Classes are blueprints defining properties and behaviors. Objects are instances of these blueprints allocated in memory.',
        concepts: [
          { title: 'Class', text: 'The compile-time template or blueprint definition.' },
          { title: 'Object', text: 'The runtime instance created using the "new" keyword.' },
          { title: 'State & Behavior', text: 'State is stored in fields, and behavior is executed through methods.' }
        ],
        code: 'public class Car {\n    public string Model { get; set; } // State\n    public void Drive() => Console.WriteLine("Driving!"); // Behavior\n}\n\nCar myCar = new Car() { Model = "Sedan" }; // Object instance',
        pitfalls: 'Confusing the class definition with the object instance, or attempting to read instance members on a null object reference.',
        questions: [
          { id: 'oop-co-q1', question: 'What is the difference between a class and an object?', answer: 'A class is a logical blueprint. An object is a physical instance of that blueprint allocated in memory.' },
          { id: 'oop-co-q2', question: 'What is instantiation?', answer: 'The process of creating an object instance in memory using a class constructor.' }
        ]
      },
      {
        id: 'oop-four-pillars-deep',
        title: 'The Four Pillars of OOP',
        desc: 'Discover Encapsulation, Abstraction, Inheritance, and Polymorphism, and how they apply to domain design.',
        concepts: [
          { title: 'Encapsulation', text: 'Hiding internal state variables and exposing access through public methods.' },
          { title: 'Abstraction', text: 'Hiding complex implementation details and showing only the essential interfaces.' },
          { title: 'Inheritance', text: 'Reusing class structure from parents to child subclasses.' },
          { title: 'Polymorphism', text: 'Handling multiple types through a single base contract.' }
        ],
        code: 'public abstract class PaymentProvider {\n    public abstract void ProcessPayment(decimal amount);\n}\npublic class StripeProvider : PaymentProvider {\n    public override void ProcessPayment(decimal amount) => Console.WriteLine($"Stripe charged {amount}");\n}',
        pitfalls: 'Deep inheritance hierarchies that violate Liskov Substitution, coupling child classes tightly to base class implementations.',
        questions: [
          { id: 'oop-pill-q1', question: 'How does polymorphism improve software flexibility?', answer: 'It allows code to operate on abstract contracts, making it easy to swap implementations without modifying callers.' },
          { id: 'oop-pill-q2', question: 'What is encapsulation?', answer: 'Bundling data and methods into a class and restricting direct access to object internals to protect state integrity.' }
        ]
      },
      {
        id: 'oop-encapsulation-modifiers',
        title: 'Encapsulation & Access Modifiers',
        desc: 'Expose class members selectively using access modifiers: private, protected, internal, public, and private protected.',
        concepts: [
          { title: 'Private', text: 'Restricts access to the defining class body only.' },
          { title: 'Protected', text: 'Allows access inside the class and its derived child classes.' },
          { title: 'Public & Internal', text: 'Public allows universal access. Internal limits access to the compilation assembly.' }
        ],
        code: 'public class BankAccount {\n    private decimal balance = 0; // Private backing field\n    public decimal Balance => balance; // Read-only property\n    public void Deposit(decimal amount) => balance += amount;\n}',
        pitfalls: 'Making all class fields public by default, which bypasses validation rules and breaks encapsulation.',
        questions: [
          { id: 'oop-mod-q1', question: 'What is the purpose of the internal access modifier?', answer: 'It limits class or member visibility to the containing assembly, preventing usage by external projects.' },
          { id: 'oop-mod-q2', question: 'Why is encapsulation critical for data validation?', answer: 'By restricting direct access to fields, it forces callers to go through properties or methods that validate inputs.' }
        ]
      },
      {
        id: 'oop-inheritance-poly',
        title: 'Inheritance & Polymorphism',
        desc: 'Establish IS-A relationships and override base class behaviors to implement dynamic runtime dispatch.',
        concepts: [
          { title: 'Virtual & Override', text: 'Declaring methods as virtual in base classes to allow derived overrides.' },
          { title: 'Base Keyword', text: 'Invoking parent constructors or methods from within child classes.' },
          { title: 'Runtime Binding', text: 'The CLR determines which method to execute based on runtime object type.' }
        ],
        code: 'public class Shape { public virtual void Draw() => Console.WriteLine("Drawing Shape"); }\npublic class Circle : Shape { public override void Draw() => Console.WriteLine("Drawing Circle"); }',
        pitfalls: 'Using inheritance for code sharing when there is no IS-A relationship, which creates fragile hierarchies.',
        questions: [
          { id: 'oop-inh-q1', question: 'What is the difference between shadow (new) and override methods in C#?', answer: 'override replaces the base method, preserving polymorphism. new hides the base method, disabling polymorphic dispatch.' },
          { id: 'oop-inh-q2', question: 'How is runtime polymorphism resolved?', answer: 'The runtime looks at the actual object type on the heap (vtable lookup) rather than the variable reference type.' }
        ]
      },
      {
        id: 'oop-overloading-overriding',
        title: 'Method Overloading vs Method Overriding',
        desc: 'Differentiate between static polymorphism (compile-time overloading) and dynamic polymorphism (runtime overriding).',
        concepts: [
          { title: 'Overloading', text: 'Multiple methods in a class with the same name but different signatures.' },
          { title: 'Overriding', text: 'Replacing a parent class virtual method with a custom subclass version.' },
          { title: 'Compile-time vs Runtime', text: 'Overloads are selected by the compiler; overrides are resolved at runtime.' }
        ],
        code: 'public class Calculator {\n    public int Add(int a, int b) => a + b; // Overload 1\n    public double Add(double a, double b) => a + b; // Overload 2\n}',
        pitfalls: 'Creating overloads with ambiguous parameter signatures, causing compiler errors.',
        questions: [
          { id: 'oop-over-q1', question: 'Is method overloading determined at runtime?', answer: 'No, method overloading is resolved at compile-time by matching the argument list to available signatures.' },
          { id: 'oop-over-q2', question: 'Can you override static methods in C#?', answer: 'No, static methods belong to the class itself, not to instances, and cannot be marked as virtual or overridden.' }
        ]
      },
      {
        id: 'oop-abstract-interfaces',
        title: 'Abstract Classes vs Interfaces',
        desc: 'Choose between abstract classes (providing shared state and base features) and interfaces (defining behavior contracts).',
        concepts: [
          { title: 'Abstract Class', text: 'A partial class blueprint that can define constructors and state fields.' },
          { title: 'Interface', text: 'A contract that can be implemented by any class or struct.' },
          { title: 'Multiple Inheritance', text: 'C# allows implementing multiple interfaces but only inheriting from one class.' }
        ],
        code: 'public interface IFlyable { void Fly(); }\npublic abstract class Bird { public abstract void Eat(); }',
        pitfalls: 'Using an abstract class when an interface is needed, which limits subclass options due to C#\'s single inheritance rule.',
        questions: [
          { id: 'oop-abs-q1', question: 'When should you use an abstract class over an interface?', answer: 'Use an abstract class when you want to provide shared code, constructors, or internal state (fields) to all subclasses.' },
          { id: 'oop-abs-q2', question: 'Can an interface have fields in C#?', answer: 'No, interfaces cannot declare instance fields, though they can declare properties (which act as get/set method contracts).' }
        ]
      },
      {
        id: 'oop-composition-inheritance',
        title: 'Composition vs Inheritance',
        desc: 'Favor composition over inheritance to create flexible, loosely coupled designs using HAS-A relationships.',
        concepts: [
          { title: 'Inheritance (IS-A)', text: 'Tightly binds derived classes to base class code (compile-time).' },
          { title: 'Composition (HAS-A)', text: 'Referencing helper classes inside an object, allowing runtime switches.' },
          { title: 'Loose Coupling', text: 'Composition makes classes easier to test by injecting mock dependencies.' }
        ],
        code: 'public class Engine { public void Start() => Console.WriteLine("Vroom"); }\npublic class Car {\n    private Engine engine = new Engine(); // Composition\n    public void Drive() => engine.Start();\n}',
        pitfalls: 'Creating deep class hierarchies for code reuse, making the system fragile when base class code changes.',
        questions: [
          { id: 'oop-comp-q1', question: 'Why is "favor composition over inheritance" a best practice?', answer: 'Because composition creates loosely coupled systems where classes can change independently without breaking child class assumptions.' },
          { id: 'oop-comp-q2', question: 'What is a HAS-A relationship?', answer: 'A design relationship where one class holds a reference to an instance of another class to delegate work.' }
        ]
      },
      {
        id: 'oop-solid',
        title: 'SOLID Principles',
        desc: 'Learn the five core principles of object-oriented design to keep software maintainable, extensible, and clean.',
        concepts: [
          { title: 'Single Responsibility', text: 'A class should have only one reason to change.' },
          { title: 'Open/Closed', text: 'Classes should be open for extension but closed for modification.' },
          { title: 'Liskov Substitution', text: 'Subclasses must be substitutable for their parent classes without errors.' },
          { title: 'Interface Segregation', text: 'Prefer small, focused interfaces over large, general-purpose ones.' },
          { title: 'Dependency Inversion', text: 'High-level modules should depend on interfaces, not concrete implementations.' }
        ],
        code: 'public interface IRepository { void Save(); }\npublic class SqlRepository : IRepository { public void Save() { /* Sql logic */ } }\npublic class Controller {\n    private IRepository repo;\n    public Controller(IRepository r) => repo = r; // Inversion of Dependency\n}',
        pitfalls: 'Writing monolithic classes that handle database access, validation, and email notification, violating the Single Responsibility Principle.',
        questions: [
          { id: 'oop-solid-q1', question: 'How does Dependency Inversion relate to Dependency Injection?', answer: 'Dependency Inversion is the design goal (coding to interfaces). Dependency Injection is the mechanism used to pass dependencies at runtime.' },
          { id: 'oop-solid-q2', question: 'What does the Open/Closed Principle solve?', answer: 'It prevents introducing bugs into working production code by adding features via subclasses or interfaces instead of modifying existing classes.' }
        ]
      },
      {
        id: 'oop-grasp',
        title: 'GRASP Patterns',
        desc: 'General Responsibility Assignment Software Patterns (GRASP) outline object design and class responsibility assignment guidelines.',
        concepts: [
          { title: 'Information Expert', text: 'Assign responsibility to the class that holds the required information.' },
          { title: 'Creator', text: 'Assign class B responsibility to create class A if B aggregates or uses A closely.' },
          { title: 'Controller', text: 'First object beyond the UI that coordinates system operations.' }
        ],
        code: '// Information Expert Example\npublic class OrderItem { public decimal Price; public int Qty; }\npublic class Order {\n    private List<OrderItem> items;\n    public decimal GetTotal() => items.Sum(i => i.Price * i.Qty); // Information Expert\n}',
        pitfalls: 'Assigning calculation logic to a controller instead of the object that owns the data, violating the Information Expert pattern.',
        questions: [
          { id: 'oop-grasp-q1', question: 'What is the Information Expert pattern?', answer: 'A principle stating that responsibility should be assigned to the information expert—the object that has the information necessary to fulfill the responsibility.' },
          { id: 'oop-grasp-q2', question: 'What is the Creator pattern in GRASP?', answer: 'It guides deciding which object should create a new instance of a class based on ownership and reference relationships.' }
        ]
      },
      {
        id: 'oop-coupling-cohesion',
        title: 'Coupling & Cohesion',
        desc: 'Aim for high cohesion (focused class responsibility) and loose coupling (minimized class dependencies).',
        concepts: [
          { title: 'High Cohesion', text: 'A class does one job and does it completely, keeping logic focused.' },
          { title: 'Loose Coupling', text: 'Minimizing relationships between classes so changes are isolated.' },
          { title: 'Refactoring benefits', text: 'Cohesive and loosely coupled systems are easier to test and modify.' }
        ],
        code: '// High Cohesion: Focused purely on parsing JSON\npublic class JsonParser {\n    public T Parse<T>(string data) => JsonSerializer.Deserialize<T>(data);\n}',
        pitfalls: 'Creating "God Classes" (low cohesion) that manage many unrelated tasks, making the codebase fragile.',
        questions: [
          { id: 'oop-cc-q1', question: 'What is the difference between coupling and cohesion?', answer: 'Cohesion refers to how focused a class\'s responsibilities are. Coupling refers to how dependent classes are on each other.' },
          { id: 'oop-cc-q2', question: 'Why is high coupling bad?', answer: 'Because a change in one class forces changes across many other classes, creating a fragile system.' }
        ]
      },
      {
        id: 'oop-relationships',
        title: 'Association, Aggregation, and Composition',
        desc: 'Understand the differences between object relationships: Association (using), Aggregation (has a), and Composition (owns a).',
        concepts: [
          { title: 'Association', text: 'A general relationship where objects use each other (doctor and patient).' },
          { title: 'Aggregation', text: 'A weak relationship where child objects can survive without the parent (car and wheel).' },
          { title: 'Composition', text: 'A strong relationship where child objects cannot exist without the parent (house and room).' }
        ],
        code: '// Composition: Room dies if House is destroyed\npublic class House {\n    private List<Room> rooms = new List<Room>();\n}\n// Aggregation: Wheel survives if Car is destroyed\npublic class Car {\n    private List<Wheel> wheels;\n    public Car(List<Wheel> w) => wheels = w;\n}',
        pitfalls: 'Implementing relationships as Composition when they should be Aggregation, which deletes child data prematurely.',
        questions: [
          { id: 'oop-rel-q1', question: 'What is the difference between Aggregation and Composition?', answer: 'In composition, child lifetimes are controlled by the parent. In aggregation, child objects can exist independently of the parent.' },
          { id: 'oop-rel-q2', question: 'What is an Association relationship?', answer: 'A loose relationship where two independent classes interact without owning each other.' }
        ]
      },
      {
        id: 'oop-testability',
        title: 'Design for Testability',
        desc: 'Write testable code by avoiding static classes, using dependency injection, and coding to interface abstractions.',
        concepts: [
          { title: 'Inversion of Control', text: 'Letting external frameworks manage object dependencies.' },
          { title: 'Mocking abstractions', text: 'Creating dummy service classes to test units in isolation.' },
          { title: 'Avoiding global state', text: 'Avoiding singletons and static fields that make test isolation difficult.' }
        ],
        code: 'public interface IClock { DateTime Now { get; } }\npublic class OrderService {\n    private IClock clock;\n    public OrderService(IClock c) => clock = c;\n    public bool IsExpired(Order o) => clock.Now > o.ExpiryDate; // Testable!\n}',
        pitfalls: 'Instantiating external services directly (e.g. new EmailService()) inside method bodies, which makes unit testing impossible without sending real emails.',
        questions: [
          { id: 'oop-test-q1', question: 'Why does coding to interfaces improve unit testing?', answer: 'It allows swapping real dependencies (like databases or APIs) with mock classes during test execution.' },
          { id: 'oop-test-q2', question: 'How does global static state affect unit test isolation?', answer: 'Static state is shared across tests, meaning one test can modify values and cause subsequent tests to fail unexpectedly.' }
        ]
      },
      {
        id: 'oop-smells-refactoring',
        title: 'Code Smells & Refactoring',
        desc: 'Identify code smells like long methods, duplicate code, and feature envy, and apply patterns to fix them.',
        concepts: [
          { title: 'Long Parameter List', text: 'Fix by grouping related parameters into parameter objects.' },
          { title: 'Feature Envy', text: 'A method that uses data from another class more than its own. Move the method.' },
          { title: 'Refactoring definition', text: 'Improving internal code structure without changing external behavior.' }
        ],
        code: '// Before: Long parameter list\npublic void CreateUser(string name, string street, string city, string zip) { }\n// After: Parameter Object\npublic record Address(string Street, string City, string Zip);\npublic void CreateUser(string name, Address addr) { }',
        pitfalls: 'Adding features while refactoring, which makes debugging difficult if tests fail.',
        questions: [
          { id: 'oop-ref-q1', question: 'What is Feature Envy?', answer: 'A code smell where a method in class A accesses variables of class B repeatedly. Fix it by moving the method into class B.' },
          { id: 'oop-ref-q2', question: 'What is the goal of refactoring?', answer: 'To clean up code structure, improve readability, and reduce complexity without changing how the program behaves outwardly.' }
        ]
      }
    ]
  },
  'ef-core': {
    name: 'Entity Framework Core',
    topics: [
      {
        id: 'ef-intro-orms',
        title: 'Intro to EF Core & ORMs',
        desc: 'Object-Relational Mappers (ORMs) bridge the gap between relational databases and object-oriented C# code, allowing developers to query database tables using objects.',
        concepts: [
          { title: 'Object-Relational Mapping', text: 'Mapping database tables to C# classes, and columns to properties.' },
          { title: 'Entity Framework Core', text: 'Microsoft\'s lightweight, cross-platform, open-source ORM for .NET.' },
          { title: 'SQL translation', text: 'Translates LINQ expressions into optimized SQL queries.' }
        ],
        code: 'using var db = new AppDbContext();\nvar users = db.Users.Where(u => u.IsActive).ToList(); // Translates to: SELECT * FROM Users WHERE IsActive = 1',
        pitfalls: 'Expecting ORM translation to handle complex C# functions inside database query expressions, resulting in runtime conversion errors.',
        questions: [
          { id: 'ef-intro-q1', question: 'What is an ORM?', answer: 'An Object-Relational Mapper is a tool that automates database mapping and operations, translating C# code into SQL.' },
          { id: 'ef-intro-q2', question: 'What is EF Core?', answer: 'Microsoft\'s modern ORM framework for .NET, enabling databases to be queried and updated using C# objects.' }
        ]
      },
      {
        id: 'ef-dbcontext-config',
        title: 'DbContext Configuration',
        desc: 'Configure connection strings, database providers, logging, and performance flags inside the DbContext class.',
        concepts: [
          { title: 'OnConfiguring', text: 'Method inside DbContext where connection settings are set.' },
          { title: 'Database Providers', text: 'Targeting specific engines (SQL Server, PostgreSQL, SQLite).' },
          { title: 'Logging SQL queries', text: 'Configuring output streams to print generated SQL commands in development.' }
        ],
        code: 'public class AppDbContext : DbContext {\n    protected override void OnConfiguring(DbContextOptionsBuilder options)\n        => options.UseSqlServer("Server=localhost;Database=TestDb;Trusted_Connection=True;")\n                  .LogTo(Console.WriteLine, LogLevel.Information); // Logs SQL to console\n}',
        pitfalls: 'Hardcoding database connection strings inside the DbContext class, which creates security risks and deployment challenges.',
        questions: [
          { id: 'ef-conf-q1', question: 'Where should database connection strings be stored?', answer: 'In configuration files (appsettings.json) and injected using Dependency Injection.' },
          { id: 'ef-conf-q2', question: 'What does the DbContextOptions class do?', answer: 'It passes configuration settings (database provider, connection string, flags) into the DbContext constructor.' }
        ]
      },
      {
        id: 'ef-dbsets-states',
        title: 'DbSets & Entity States',
        desc: 'DbSets represent queryable database tables. The DbContext tracks entity states to determine what SQL to run during SaveChanges().',
        concepts: [
          { title: 'DbSet<T>', text: 'Represents a collection of specific entities mapped to a database table.' },
          { title: 'Entity States', text: 'Entities are tracked as Added, Unchanged, Modified, Deleted, or Detached.' },
          { title: 'SaveChanges', text: 'Scans the change tracker and executes matching SQL inserts, updates, and deletes.' }
        ],
        code: 'var user = context.Users.Find(1);\nuser.Name = "New Name"; // Tracker sets state to Modified\ncontext.SaveChanges(); // Runs UPDATE SQL',
        pitfalls: 'Adding an entity to context but forgetting to call SaveChanges(), which leaves changes uncommitted.',
        questions: [
          { id: 'ef-state-q1', question: 'What is the purpose of the Detached state?', answer: 'The entity is not being tracked by the DbContext, so changes made to it will not be saved during SaveChanges().' },
          { id: 'ef-state-q2', question: 'How do you tell EF Core to track a new record?', answer: 'By calling context.Add() or context.Set<T>().Add(), which sets the entity state to Added.' }
        ]
      },
      {
        id: 'ef-code-db-first',
        title: 'Code-First vs Database-First',
        desc: 'Choose between building the database from C# classes (Code-First) or generating C# classes from an existing database schema (Database-First).',
        concepts: [
          { title: 'Code-First', text: 'Define entities in C# and run migrations to create or update the database.' },
          { title: 'Database-First', text: 'Use CLI scaffold commands to generate C# entities from an existing database.' },
          { title: 'Model synchronization', text: 'Keeping database schemas and application models in sync.' }
        ],
        code: '// Database-First CLI Scaffolding command\n// dotnet ef dbcontext scaffold "Server=localhost;Database=Db;" Microsoft.EntityFrameworkCore.SqlServer -o Models',
        pitfalls: 'Modifying scaffolded entity files manually in Database-First, which gets overwritten when running the scaffold command again.',
        questions: [
          { id: 'ef-cd-q1', question: 'When is Code-First preferred over Database-First?', answer: 'When you are building a new application and want to manage the database schema entirely in source control using C# migrations.' },
          { id: 'ef-cd-q2', question: 'How do you keep Code-First models synced with the database?', answer: 'By creating and applying database migrations using ef CLI commands.' }
        ]
      },
      {
        id: 'ef-fluent-api-annotations',
        title: 'Fluent API vs Data Annotations',
        desc: 'Map entity properties to database columns using Data Annotation attributes or the Fluent API inside OnModelCreating.',
        concepts: [
          { title: 'Data Annotations', text: 'Attributes applied directly to entity properties ([Key], [Required]).' },
          { title: 'Fluent API', text: 'Method-chaining syntax declared inside DbContext OnModelCreating.' },
          { title: 'Advanced Configs', text: 'Fluent API supports composite keys, unique indexes, and cascade delete rules.' }
        ],
        code: 'protected override void OnModelCreating(ModelBuilder modelBuilder) {\n    modelBuilder.Entity<User>()\n        .HasIndex(u => u.Email)\n        .IsUnique(); // Unique Index via Fluent API\n}',
        pitfalls: 'Mixing Fluent API and Data Annotations inconsistently, making database schema rules hard to locate.',
        questions: [
          { id: 'ef-api-q1', question: 'Why is Fluent API preferred for complex databases?', answer: 'Because it keeps entity models clean of database metadata and supports complex configurations like composite keys and unique indexes.' },
          { id: 'ef-api-q2', question: 'Which overrides which: Data Annotations or Fluent API?', answer: 'Fluent API configurations override Data Annotations when there are conflicting rules.' }
        ]
      },
      {
        id: 'ef-migrations-seeding',
        title: 'Migrations & Schema Seeding',
        desc: 'Apply database migrations incrementally to track schema changes, and seed tables with default database records.',
        concepts: [
          { title: 'Add-Migration', text: 'Generates migration files describing Up() and Down() schema changes.' },
          { title: 'Database-Update', text: 'Applies pending migrations to target databases.' },
          { title: 'Model Seeding', text: 'Adding default values (like admin accounts or lookup tables) in OnModelCreating.' }
        ],
        code: 'protected override void OnModelCreating(ModelBuilder modelBuilder) {\n    modelBuilder.Entity<Role>().HasData(\n        new Role { Id = 1, Name = "Admin" } // Data Seeding\n    );\n}',
        pitfalls: 'Manually editing database tables directly in production, which breaks migration sequence tracking.',
        questions: [
          { id: 'ef-mig-q1', question: 'What is the role of Up and Down methods in migrations?', answer: 'Up applies schema changes when updating the database. Down reverts those changes when rolling back.' },
          { id: 'ef-mig-q2', question: 'How do you seed database lookup data in EF Core?', answer: 'Use the HasData() method inside OnModelCreating during model builder configuration.' }
        ]
      },
      {
        id: 'ef-querying-linq',
        title: 'Querying Data (LINQ to Entities)',
        desc: 'Write LINQ queries that EF Core translates into optimized SQL commands to query database records.',
        concepts: [
          { title: 'Expression Trees', text: 'EF Core parses LINQ queries as Expression Trees to translate them to SQL.' },
          { title: 'Client vs Server Evaluation', text: 'EF Core executes filters on the database server, bringing only matching records to memory.' },
          { title: 'Immediate execution methods', text: 'ToList(), First(), and Count() trigger immediate database execution.' }
        ],
        code: 'var users = context.Users.Where(u => u.Age > 21).OrderBy(u => u.Name).ToList();',
        pitfalls: 'Adding functions in LINQ queries (like user.Birthday.ToString()) that cannot be translated to SQL, causing runtime failures.',
        questions: [
          { id: 'ef-query-q1', question: 'What happens when a LINQ expression cannot be translated to SQL?', answer: 'EF Core throws an InvalidOperationException indicating that client evaluation is required.' },
          { id: 'ef-query-q2', question: 'What is the difference between Single() and First() in querying?', answer: 'First() returns the first matched item. Single() verifies that only one item matches the condition, throwing an exception if there are more.' }
        ]
      },
      {
        id: 'ef-loading-styles',
        title: 'Related Data Loading Styles (Eager, Explicit, Lazy)',
        desc: 'Load related objects from database tables using Eager Loading, Explicit Loading, or Lazy Loading.',
        concepts: [
          { title: 'Eager Loading (.Include)', text: 'Pulls related data in the initial query using SQL JOINs.' },
          { title: 'Explicit Loading (.Load)', text: 'Queries related records explicitly from the database for a loaded object.' },
          { title: 'Lazy Loading (virtual)', text: 'Pushes database queries automatically when virtual navigation properties are accessed.' }
        ],
        code: 'var users = context.Users.Include(u => u.Orders).ToList(); // Eager Loading\nvar orders = context.Entry(singleUser).Collection(u => u.Orders).Query().ToList(); // Explicit Loading',
        pitfalls: 'Using Lazy Loading without caution, leading to the N+1 query problem by running database queries inside loops.',
        questions: [
          { id: 'ef-load-q1', question: 'What is the N+1 query problem?', answer: 'An issue where accessing related data in a loop triggers separate database queries for every item in the list, hurting performance.' },
          { id: 'ef-load-q2', question: 'What keyword enables Lazy Loading in entity classes?', answer: 'The virtual keyword must be applied to navigation properties, and lazy loading proxies must be enabled in context.' }
        ]
      },
      {
        id: 'ef-tracking-notracking',
        title: 'Tracking vs No-Tracking Queries',
        desc: 'Save memory and CPU cycles by disabling the change tracker for read-only database queries.',
        concepts: [
          { title: 'AsNoTracking()', text: 'Disables tracking for the returned records, skipping change tracking checks.' },
          { title: 'Memory Overhead', text: 'Tracking queries keep copies of object states in memory, which uses more RAM.' },
          { title: 'Performance benefits', text: 'No-tracking queries run faster because they bypass entity state management.' }
        ],
        code: 'var readOnlyUsers = context.Users.AsNoTracking().Where(u => u.IsActive).ToList();',
        pitfalls: 'Attempting to save changes to an entity fetched using AsNoTracking() without attaching it back to the tracker first.',
        questions: [
          { id: 'ef-track-q1', question: 'When should you use AsNoTracking()?', answer: 'For read-only queries where returned data will not be updated or saved back to the database.' },
          { id: 'ef-track-q2', question: 'Can you save updates to an entity fetched with AsNoTracking?', answer: 'Yes, but you must attach it back using context.Update() or context.Attach() to track changes.' }
        ]
      },
      {
        id: 'ef-crud-operations',
        title: 'CRUD operations & DbContext State',
        desc: 'Perform Create, Read, Update, and Delete operations using Add, Remove, and property assignment patterns.',
        concepts: [
          { title: 'Add', text: 'Registers a new record, marking its state as Added.' },
          { title: 'Update', text: 'Attaches an entity and marks all its properties as Modified.' },
          { title: 'Remove', text: 'Marks the tracked entity state as Deleted for removal during SaveChanges().' }
        ],
        code: 'var u = new User() { Name = "John" };\ncontext.Users.Add(u); // Added\ncontext.SaveChanges(); // INSERT\n\ncontext.Users.Remove(u); // Deleted\ncontext.SaveChanges(); // DELETE',
        pitfalls: 'Calling Update() unnecessarily for tracked entities. If the object is tracked, changing its properties is automatically detected, so calling Update() is redundant.',
        questions: [
          { id: 'ef-crud-q1', question: 'Does context.Remove() immediately delete the row?', answer: 'No, it only marks the entity state as Deleted. The SQL DELETE command runs only when SaveChanges() is executed.' },
          { id: 'ef-crud-q2', question: 'What does calling Update() do to untracked entities?', answer: 'It attaches the entity to the context and marks its state as Modified, telling SaveChanges() to update all fields.' }
        ]
      },
      {
        id: 'ef-concurrency-conflicts',
        title: 'Concurrency Conflict Handling',
        desc: 'Handle multi-user concurrency updates using optimistic concurrency checks (tokens and rowversions).',
        concepts: [
          { title: 'Optimistic Concurrency', text: 'Assumes conflict is rare. Verifies rowversion values before writing updates.' },
          { title: 'Concurrency Token', text: 'Properties marked with [ConcurrencyCheck] or rowversion columns.' },
          { title: 'DbUpdateConcurrencyException', text: 'Exception thrown when another user updated the row first.' }
        ],
        code: 'try {\n    context.SaveChanges();\n} catch (DbUpdateConcurrencyException ex) {\n    var entry = ex.Entries.Single();\n    entry.OriginalValues.SetValues(entry.GetDatabaseValues()); // Database wins or Client wins resolution\n}',
        pitfalls: 'Not handling DbUpdateConcurrencyException, which crashes the app when two users update the same row simultaneously.',
        questions: [
          { id: 'ef-conc-q1', question: 'How is concurrency managed in EF Core?', answer: 'Through optimistic concurrency using RowVersion or concurrency tokens to verify columns have not changed since loading.' },
          { id: 'ef-conc-q2', question: 'What is a database-wins resolution?', answer: 'Updating the client-loaded entity values with the values currently in the database, overriding client modifications.' }
        ]
      },
      {
        id: 'ef-transactions-savepoints',
        title: 'Transactions & Savepoints',
        desc: 'Group multiple SaveChanges calls into single atomic transactions, and configure rollback savepoints.',
        concepts: [
          { title: 'Database Transactions', text: 'Ensuring all operations succeed or roll back together (BeginTransaction).' },
          { title: 'Savepoints', text: 'Markers within a transaction to allow partial rollbacks.' },
          { title: 'Isolation Levels', text: 'Setting database locks behavior during transaction execution.' }
        ],
        code: 'using var transaction = context.Database.BeginTransaction();\ntry {\n    context.SaveChanges();\n    transaction.Commit();\n} catch {\n    transaction.Rollback();\n}',
        pitfalls: 'Not using transactions when updating related records across multiple DbContext calls, risking partial database saves.',
        questions: [
          { id: 'ef-trans-q1', question: 'When is BeginTransaction required in EF Core?', answer: 'When you are coordinating database operations across multiple SaveChanges() calls or integrating external database actions.' },
          { id: 'ef-trans-q2', question: 'What are savepoints in transactions?', answer: 'Markers that allow you to roll back a transaction to a specific point, retaining operations made before the savepoint.' }
        ]
      },
      {
        id: 'ef-performance-tuning',
        title: 'Performance Tuning & Index Maps',
        desc: 'Optimize EF Core performance using compiled queries, connection pooling, and indexing strategies.',
        concepts: [
          { title: 'DbContext Pooling', text: 'Reuses DbContext instances to avoid construction overhead.' },
          { title: 'Compiled Queries', text: 'Caches query translations to speed up repetitive database calls.' },
          { title: 'Query Splitting', text: 'Splitting large queries into separate SQL queries to prevent Cartesian explosion.' }
        ],
        code: 'builder.Services.AddDbContextPool<AppDbContext>(options => \n    options.UseSqlServer(connectionString)); // Context pooling',
        pitfalls: 'Using .Include() on many nested collections, which generates complex JOIN queries that slow down the database.',
        questions: [
          { id: 'ef-tune-q1', question: 'What is DbContext Pooling?', answer: 'A feature that reuses pre-created DbContext instances from a pool, reducing thread overhead during app startup.' },
          { id: 'ef-tune-q2', question: 'How does Query Splitting solve Cartesian explosion?', answer: 'By sending separate SQL queries to fetch related data instead of a single query with multiple JOINs, reducing duplicate data.' }
        ]
      },
      {
        id: 'ef-shadow-properties-filters',
        title: 'Shadow Properties & Global Filters',
        desc: 'Implement soft deletes and multi-tenant security using shadow properties and global query filters.',
        concepts: [
          { title: 'Shadow Properties', text: 'Properties defined in EF Core metadata that do not exist in the C# class.' },
          { title: 'Global Query Filters', text: 'Query filters applied to entities automatically (e.g., HasQueryFilter).' },
          { title: 'Soft Deletes', text: 'Setting an IsDeleted flag instead of deleting database rows.' }
        ],
        code: 'modelBuilder.Entity<Product>()\n    .HasQueryFilter(p => !p.IsDeleted); // Global Filter\n\nmodelBuilder.Entity<Product>()\n    .Property<DateTime>("LastUpdated"); // Shadow Property',
        pitfalls: 'Forgetting how to bypass global query filters when you need to load deleted records (requires using IgnoreQueryFilters()).',
        questions: [
          { id: 'ef-shad-q1', question: 'What is a Shadow Property?', answer: 'A property that exists in the database table and EF Core model, but has no matching field in the C# entity class.' },
          { id: 'ef-shad-q2', question: 'How do you bypass a global query filter?', answer: 'By applying the IgnoreQueryFilters() extension method to the query.' }
        ]
      },
      {
        id: 'ef-interceptors-events',
        title: 'Interceptors and DbContext Events',
        desc: 'Intercept database commands and execution states to automate auditing, logging, and data modifications.',
        concepts: [
          { title: 'Interceptors', text: 'Classes that run code before or after database commands (SaveChangesInterceptor).' },
          { title: 'SavedChanges Event', text: 'Subscribing to notifications after data is saved.' },
          { title: 'Auditing data', text: 'Automatically updating CreatedDate or UpdatedBy fields.' }
        ],
        code: 'public class AuditInterceptor : SaveChangesInterceptor {\n    public override InterceptionResult<int> SavingChanges(\n        DbContextEventData eventData, InterceptionResult<int> result) {\n        // Audit logic: Set UpdatedDate\n        return base.SavingChanges(eventData, result);\n    }\n}',
        pitfalls: 'Adding slow, block-heavy code inside interceptors, which adds latency to every database command.',
        questions: [
          { id: 'ef-int-q1', question: 'What is an EF Core Interceptor?', answer: 'A class that hooks into database execution steps, allowing commands to be modified or monitored before they run.' },
          { id: 'ef-int-q2', question: 'How do you automate setting CreatedBy audit properties?', answer: 'By overriding SavingChanges or using a SaveChangesInterceptor to scan tracked entities for audit interfaces.' }
        ]
      },
      {
        id: 'ef-testing-inmemory',
        title: 'Testing with In-Memory & SQLite',
        desc: 'Unit test database logic using the EF Core In-Memory provider or local SQLite databases.',
        concepts: [
          { title: 'In-Memory Database', text: 'A fast, lightweight RAM provider. Does not enforce relational constraints.' },
          { title: 'SQLite In-Memory', text: 'A relational in-memory database that enforces foreign keys and index rules.' },
          { title: 'Test Isolation', text: 'Creating a new database instance per unit test to prevent data overlap.' }
        ],
        code: 'var options = new DbContextOptionsBuilder<AppDbContext>()\n    .UseInMemoryDatabase(databaseName: "TestDb")\n    .Options;\nusing var context = new AppDbContext(options);',
        pitfalls: 'Using the In-Memory provider to test raw SQL queries or database-specific features (like JSON query extensions).',
        questions: [
          { id: 'ef-test-q1', question: 'Why is SQLite preferred over the In-Memory provider for testing?', answer: 'Because SQLite is a real relational database that enforces constraints, whereas the In-Memory provider does not check relations or indexes.' },
          { id: 'ef-test-q2', question: 'How do you ensure test isolation when database testing?', answer: 'By creating a fresh in-memory database name or connection instance per test run.' }
        ]
      }
    ]
  },
  'linq': {
    name: 'LINQ',
    topics: [
      {
        id: 'linq-intro',
        title: 'Introduction to LINQ',
        desc: 'LINQ (Language Integrated Query) brings declarative querying directly into C#, allowing data to be filtered, sorted, and mapped.',
        concepts: [
          { title: 'Declarative Querying', text: 'Write readable query logic instead of nested loop statements.' },
          { title: 'LINQ Providers', text: 'Targets different sources: LINQ to Objects, LINQ to SQL, and LINQ to XML.' },
          { title: 'Extension Methods', text: 'Methods like Where and Select that extend collections.' }
        ],
        code: 'string[] names = { "Tom", "Dick", "Harry" };\nvar matched = names.Where(n => n.Length == 3);\n// Returns Tom, Dick',
        pitfalls: 'Assuming LINQ makes queries run faster. LINQ is a syntax compiler helper; it does not bypass the performance of underlying loops.',
        questions: [
          { id: 'linq-int-q1', question: 'What does LINQ stand for?', answer: 'Language Integrated Query, a feature adding declarative query capabilities to C#.' },
          { id: 'linq-int-q2', question: 'What is a LINQ Provider?', answer: 'A library that translates LINQ expressions into queries for specific data sources, like databases or XML.' }
        ]
      },
      {
        id: 'linq-enum-queryable',
        title: 'IEnumerable vs IQueryable vs IOrderedEnumerable',
        desc: 'Understand the difference between querying in-memory collections (IEnumerable) and generating database queries (IQueryable).',
        concepts: [
          { title: 'IEnumerable', text: 'Ideal for in-memory collections. Filters records client-side using delegates.' },
          { title: 'IQueryable', text: 'Ideal for database sources. Translates expression trees into SQL queries.' },
          { title: 'IOrderedEnumerable', text: 'Returned by OrderBy calls, allowing subsequent ThenBy ordering.' }
        ],
        code: 'IEnumerable<User> inMemory = GetUsersList().Where(u => u.Age > 18); // In-memory\nIQueryable<User> dbQuery = dbContext.Users.Where(u => u.Age > 18); // Translates to SQL',
        pitfalls: 'Casting an IQueryable query to IEnumerable before filtering, which pulls all table rows into memory before applying the filter.',
        questions: [
          { id: 'linq-enum-q1', question: 'What is the main difference between IEnumerable and IQueryable?', answer: 'IEnumerable is for in-memory queries (in-process). IQueryable parses query expressions to run them on external sources like databases.' },
          { id: 'linq-enum-q2', question: 'Why is casting to IEnumerable mid-query bad for databases?', answer: 'It causes EF Core to execute the SQL immediately and pull all records into memory, running subsequent filters locally.' }
        ]
      },
      {
        id: 'linq-deferred-immediate-deep',
        title: 'Deferred vs Immediate Execution',
        desc: 'Understand when LINQ queries are evaluated: deferred iteration vs immediate materialization.',
        concepts: [
          { title: 'Deferred execution', text: 'The query builds a pipeline but does not run until you iterate over it.' },
          { title: 'Immediate execution', text: 'Methods like ToList(), Count(), and First() run the query immediately.' },
          { title: 'Query reuse', text: 'A deferred query can be rerun after modifying the underlying collection.' }
        ],
        code: 'var list = new List<int> { 1, 2 };\nvar query = list.Where(x => x > 1); // Deferred\nlist.Add(3);\nforeach (var v in query) Console.WriteLine(v); // Outputs 2, 3',
        pitfalls: 'Running database queries multiple times by iterating over a deferred LINQ query in a loop instead of calling ToList().',
        questions: [
          { id: 'linq-def-q1', question: 'What is deferred execution?', answer: 'The query is evaluated only when the query variable is iterated or converted, not when defined.' },
          { id: 'linq-def-q2', question: 'How do you force immediate execution of a LINQ query?', answer: 'By calling collection conversion methods like ToList(), ToArray(), or ToDictionary().' }
        ]
      },
      {
        id: 'linq-syntax-comparison',
        title: 'Query Syntax vs Method Syntax',
        desc: 'Compare declarative Query syntax (from-select) with functional Method syntax (lambda extensions).',
        concepts: [
          { title: 'Query Syntax', text: 'Looks like SQL. Compiled into equivalent method syntax.' },
          { title: 'Method Syntax', text: 'Uses extension methods and lambdas. Required for operators like Skip or Take.' },
          { title: 'Readability', text: 'Query syntax is often easier to read for complex joins and groupings.' }
        ],
        code: '// Query Syntax\nvar q1 = from u in users where u.Active select u.Name;\n\n// Method Syntax (Equivalent)\nvar q2 = users.Where(u => u.Active).Select(u => u.Name);',
        pitfalls: 'Mixing query and method syntax in a confusing way, making the code hard to read.',
        questions: [
          { id: 'linq-synt-q1', question: 'Which syntax is compiled into the other?', answer: 'The compiler translates Query syntax into Method syntax extension calls before compilation.' },
          { id: 'linq-synt-q2', question: 'When is Method syntax required?', answer: 'For operators that do not have query keywords, such as Take, Skip, First, or ToList.' }
        ]
      },
      {
        id: 'linq-filtering',
        title: 'Filtering Operators (Where, OfType)',
        desc: 'Filter data streams based on conditions or object type structures.',
        concepts: [
          { title: 'Where', text: 'Filters items using a boolean condition.' },
          { title: 'OfType<T>', text: 'Filters a collection, returning only objects of the specified type T.' },
          { title: 'Predicate matching', text: 'Using expressions to filter records.' }
        ],
        code: 'object[] items = { "Tom", 2, "Harry", 4 };\nvar strings = items.OfType<string>(); // Returns Tom, Harry',
        pitfalls: 'Using OfType<T>() with database tables when table structures are not mapped to class inheritance, causing translation failures.',
        questions: [
          { id: 'linq-filt-q1', question: 'What does OfType<T>() do?', answer: 'It filters a collection, returning only the elements that match the specified type T.' },
          { id: 'linq-filt-q2', question: 'Can you write multiple conditions in a single Where clause?', answer: 'Yes, using logical operators (&&, ||) inside the lambda expression.' }
        ]
      },
      {
        id: 'linq-projection',
        title: 'Projection Operators (Select, SelectMany)',
        desc: 'Project source records into new shapes, and flatten nested lists using Select and SelectMany.',
        concepts: [
          { title: 'Select (1-to-1)', text: 'Transforms each source element into a new object shape.' },
          { title: 'SelectMany (1-to-Many)', text: 'Projects and flattens nested lists of lists into a single collection.' },
          { title: 'Anonymous Types', text: 'Creating temporary classes to hold selected columns.' }
        ],
        code: 'var names = users.Select(u => u.Name); // List of strings\nvar allOrders = users.SelectMany(u => u.Orders); // Flattens orders lists',
        pitfalls: 'Using Select when SelectMany is needed, resulting in a nested collection (IEnumerable<List<T>>) instead of a flat list (IEnumerable<T>).',
        questions: [
          { id: 'linq-proj-q1', question: 'What is the difference between Select and SelectMany?', answer: 'Select transforms elements individually. SelectMany flattens nested collections into a single sequence.' },
          { id: 'linq-proj-q2', question: 'What is projection?', answer: 'The process of selecting columns or transforming objects into new shapes (like DTOs or anonymous types).' }
        ]
      },
      {
        id: 'linq-sorting',
        title: 'Sorting Operators (OrderBy, ThenBy)',
        desc: 'Sort elements in ascending or descending order, and chain multiple sorting rules.',
        concepts: [
          { title: 'OrderBy', text: 'Sorts elements in ascending order by a key.' },
          { title: 'OrderByDescending', text: 'Sorts elements in descending order.' },
          { title: 'ThenBy', text: 'Applies subsequent sorting rules to items that had matching keys in OrderBy.' }
        ],
        code: 'var sorted = users.OrderBy(u => u.LastName)\n                   .ThenBy(u => u.FirstName);',
        pitfalls: 'Chaining multiple OrderBy calls (e.g. OrderBy().OrderBy()), which resets the sorting instead of using ThenBy().',
        questions: [
          { id: 'linq-sort-q1', question: 'Why is OrderBy followed by another OrderBy incorrect?', answer: 'Because the second OrderBy resets the sorting of the list, ignoring the first sorting rule. Use ThenBy instead.' },
          { id: 'linq-sort-q2', question: 'What does ThenBy do?', answer: 'It performs a secondary sort on elements that had matching values in the primary sort.' }
        ]
      },
      {
        id: 'linq-joins',
        title: 'Joining Operators (Join, GroupJoin)',
        desc: 'Join collections based on matching keys, implementing SQL-like Inner and Outer joins.',
        concepts: [
          { title: 'Join', text: 'Correlates two sequences based on matching keys (Inner Join).' },
          { title: 'GroupJoin', text: 'Correlates sequences, grouping matching records by key (Left Outer Join).' },
          { title: 'Key Selectors', text: 'Defining columns to match from the left and right sequences.' }
        ],
        code: 'var joined = users.Join(orders, u => u.Id, o => o.UserId,\n    (u, o) => new { u.Name, o.Total });',
        pitfalls: 'Using Join on in-memory collections with slow key comparisons, which hurts performance on large lists.',
        questions: [
          { id: 'linq-join-q1', question: 'What is the SQL equivalent of GroupJoin?', answer: 'A LEFT OUTER JOIN, which groups matching right-side records for each left-side record.' },
          { id: 'linq-join-q2', question: 'How does Join relate keys?', answer: 'It compares keys from the outer and inner sequences, outputting matches based on key equality.' }
        ]
      },
      {
        id: 'linq-grouping',
        title: 'Grouping Operators (GroupBy, ToLookup)',
        desc: 'Group elements in collections by keys, and compare deferred GroupBy queries with immediate Lookup cache.',
        concepts: [
          { title: 'GroupBy', text: 'Groups elements into key-value pairs (deferred execution).' },
          { title: 'ToLookup', text: 'Creates an in-memory dictionary-like lookup cache (immediate execution).' },
          { title: 'IGrouping<TKey, TElement>', text: 'The interface returned by grouping queries, containing Key and collection values.' }
        ],
        code: 'var grouped = users.GroupBy(u => u.Role);\n// Each group has .Key (Role) and can be iterated as a list of Users',
        pitfalls: 'Assuming GroupBy behaves like SQL Group By, which aggregates rows. LINQ GroupBy groups objects into nested lists, not flat summaries.',
        questions: [
          { id: 'linq-grp-q1', question: 'What is the difference between GroupBy and ToLookup?', answer: 'GroupBy is deferred. ToLookup executes immediately, creating a cached lookup table in memory.' },
          { id: 'linq-grp-q2', question: 'What type of structure does GroupBy return?', answer: 'An IEnumerable of IGrouping<TKey, TElement> objects.' }
        ]
      },
      {
        id: 'linq-set-operators',
        title: 'Set Operators (Union, Intersect, Except)',
        desc: 'Combine collections using set logic: Union, Intersect, Except, and Distinct.',
        concepts: [
          { title: 'Distinct', text: 'Filters out duplicate values from a sequence.' },
          { title: 'Union', text: 'Combines two sequences, removing duplicate values.' },
          { title: 'Intersect / Except', text: 'Intersect finds common items. Except filters out matching items.' }
        ],
        code: 'int[] seq1 = { 1, 2, 2, 3 };\nvar unique = seq1.Distinct(); // 1, 2, 3\nint[] seq2 = { 3, 4 };\nvar combined = seq1.Union(seq2); // 1, 2, 3, 4',
        pitfalls: 'Using set operators on custom objects without implementing IEquatable<T> or providing a custom IEqualityComparer, which prevents duplicates from being detected.',
        questions: [
          { id: 'linq-set-q1', question: 'Why does Distinct() not filter duplicate objects by default?', answer: 'Because default object comparisons check reference equality. You must override GetHashCode/Equals or pass an IEqualityComparer.' },
          { id: 'linq-set-q2', question: 'What is the difference between Union and Concat?', answer: 'Union combines lists and removes duplicates. Concat appends lists together, retaining duplicates.' }
        ]
      },
      {
        id: 'linq-element-operators',
        title: 'Element Operators (First, Single, ElementAt)',
        desc: 'Query single elements from sequences using First, Single, Last, and ElementAt operators.',
        concepts: [
          { title: 'First / FirstOrDefault', text: 'Returns the first match. Default versions return null/default if no match is found.' },
          { title: 'Single / SingleOrDefault', text: 'Returns the only match. Throws if multiple items match.' },
          { title: 'ElementAt', text: 'Retrieves the element at a specific index location.' }
        ],
        code: 'var firstAdmin = users.FirstOrDefault(u => u.Role == "Admin");\nvar singleOwner = users.SingleOrDefault(u => u.Role == "Owner");',
        pitfalls: 'Calling First() on an empty collection, which throws an InvalidOperationException. Best practice is to use FirstOrDefault() and check for null.',
        questions: [
          { id: 'linq-elem-q1', question: 'When should SingleOrDefault() be used instead of FirstOrDefault()?', answer: 'When it is a validation error for more than one item to match the condition (e.g. searching by unique email).' },
          { id: 'linq-elem-q2', question: 'What does FirstOrDefault() return if a collection is empty?', answer: 'It returns the default value for the type (null for reference types, or zero/default for value types).' }
        ]
      },
      {
        id: 'linq-aggregation',
        title: 'Aggregation Operators (Count, Average, Aggregate)',
        desc: 'Compute summaries over collections: Count, Sum, Min, Max, Average, and custom Aggregations.',
        concepts: [
          { title: 'Basic Aggregations', text: 'Methods like Count(), Sum(), Min(), and Max() to summarize values.' },
          { title: 'Average', text: 'Calculates the arithmetic mean of numeric properties.' },
          { title: 'Aggregate', text: 'Performs custom accumulator calculations (like reducing values).' }
        ],
        code: 'int[] nums = { 1, 2, 3, 4 };\nint sum = nums.Sum(); // 10\nstring combined = nums.Select(n => n.ToString())\n                      .Aggregate((a, b) => a + "," + b); // "1,2,3,4"',
        pitfalls: 'Calling Min() or Max() on an empty collection, which throws an InvalidOperationException.',
        questions: [
          { id: 'linq-agg-q1', question: 'What is the purpose of the Aggregate operator?', answer: 'It runs a custom accumulator function over a sequence, reducing the collection to a single value.' },
          { id: 'linq-agg-q2', question: 'Does calling Count() on a List run a database query?', answer: 'If called on List<T>, it uses the List.Count property instantly. If called on IQueryable, it runs a SELECT COUNT SQL query.' }
        ]
      },
      {
        id: 'linq-partitioning',
        title: 'Partitioning Operators (Take, Skip)',
        desc: 'Split collections for pagination using Take, Skip, TakeWhile, and SkipWhile operators.',
        concepts: [
          { title: 'Take', text: 'Selects the first N elements of a sequence.' },
          { title: 'Skip', text: 'Skips the first N elements and returns the remaining elements.' },
          { title: 'TakeWhile / SkipWhile', text: 'Skips/Takes elements as long as a condition evaluates to true.' }
        ],
        code: '// Page 3 query (assuming 10 items per page)\nvar page3 = users.Skip(20).Take(10).ToList();',
        pitfalls: 'Calling Skip() without an OrderBy, which can return inconsistent results from databases because relational table orders are not guaranteed.',
        questions: [
          { id: 'linq-part-q1', question: 'How is database pagination implemented in LINQ?', answer: 'By combining Skip((pageNumber - 1) * pageSize) and Take(pageSize) on sorted queries.' },
          { id: 'linq-part-q2', question: 'What is the difference between Take and TakeWhile?', answer: 'Take selects a fixed number of items. TakeWhile selects items dynamically as long as a condition remains true, stopping at the first failure.' }
        ]
      },
      {
        id: 'linq-generation',
        title: 'Generation Operators (Range, Repeat, Empty)',
        desc: 'Create dummy data sequences using Enumerable.Range, Enumerable.Repeat, and Enumerable.Empty.',
        concepts: [
          { title: 'Enumerable.Range', text: 'Generates a sequence of integers within a specified range.' },
          { title: 'Enumerable.Repeat', text: 'Generates a sequence containing one repeated value.' },
          { title: 'Enumerable.Empty<T>', text: 'Returns an empty, cached IEnumerable sequence, avoiding allocation.' }
        ],
        code: 'var range = Enumerable.Range(1, 10); // 1, 2... 10\nvar repeated = Enumerable.Repeat("Draft", 3); // Draft, Draft, Draft',
        pitfalls: 'Allocating new empty arrays instead of using Enumerable.Empty<T>(), which wastes memory allocations in API pipelines.',
        questions: [
          { id: 'linq-gen-q1', question: 'Why is Enumerable.Empty<T>() preferred over creating empty arrays?', answer: 'Because it returns a cached internal singleton instance, avoiding memory allocation overhead.' },
          { id: 'linq-gen-q2', question: 'What are the arguments for Enumerable.Range(start, count)?', answer: 'The first argument is the starting integer. The second is the count of sequential integers to generate.' }
        ]
      },
      {
        id: 'linq-custom-expression',
        title: 'Custom Operators & Expression Trees',
        desc: 'Build custom query extensions and work with Expression Trees to translate custom syntax into database commands.',
        concepts: [
          { title: 'Custom Extensions', text: 'Creating custom LINQ query methods using "this IEnumerable" syntax.' },
          { title: 'Expression Trees', text: 'Representing code structures as data nodes (Expression<Func<T, bool>>) to parse at runtime.' },
          { title: 'Query Translation', text: 'How ORM providers parse expressions to generate SQL.' }
        ],
        code: '// Expression parameter matching\nExpression<Func<User, bool>> expr = u => u.Age > 18;\nParameterExpression param = expr.Parameters[0]; // Parses "u" as parameter node',
        pitfalls: 'Failing to differentiate between Func<T> (compiled delegate code) and Expression<Func<T>> (data structure representing code), which disables database translation.',
        questions: [
          { id: 'linq-expr-q1', question: 'What is an Expression Tree?', answer: 'A data structure that represents a compiler expression in a tree layout, allowing runtime analysis and translation (e.g. to SQL).' },
          { id: 'linq-expr-q2', question: 'Why does EF Core accept Expression<Func<T, bool>> instead of Func<T, bool>?', answer: 'Because it needs to inspect the query structure to write SQL. A Func is compiled binary code, which cannot be inspected or translated.' }
        ]
      }
    ]
  },
  'signalr': {
    name: 'SignalR',
    topics: [
      {
        id: 'sig-intro',
        title: 'Intro to Real-Time Web & SignalR',
        desc: 'ASP.NET Core SignalR simplifies adding real-time web functionality, allowing server-side code to push content to connected clients instantly.',
        concepts: [
          { title: 'Real-Time Web', text: 'Enables instant updates without browser page reloads.' },
          { title: 'Bidirectional Connection', text: 'Both client and server can send messages simultaneously.' },
          { title: 'Connection Fallback', text: 'Automatically selects the best communication channel (WebSockets, SSE, or Long Polling).' }
        ],
        code: '// In Program.cs\nbuilder.Services.AddSignalR();\n// ...\napp.MapHub<ChatHub>("/chat");',
        pitfalls: 'Assuming SignalR is only for chat apps. It is ideal for dashboards, status feeds, and collaborative editors.',
        questions: [
          { id: 'sig-intro-q1', question: 'What does SignalR do?', answer: 'It manages connections and allows real-time, bi-directional communication between client and server.' },
          { id: 'sig-intro-q2', question: 'What is connection fallback?', answer: 'The automatic process where SignalR falls back to simpler protocols if WebSockets are blocked by proxies or networks.' }
        ]
      },
      {
        id: 'sig-hubs',
        title: 'Hub Architecture & Remote Procedure Calls',
        desc: 'Hubs are the high-level communications pipeline in SignalR that let servers and clients invoke methods on each other.',
        concepts: [
          { title: 'Hub Class', text: 'Inherits from Hub, acting as the endpoint for client actions.' },
          { title: 'Remote Procedure Calls (RPC)', text: 'Executing functions across the network as if they were local.' },
          { title: 'Clients Property', text: 'Specifies which connected clients receive the message.' }
        ],
        code: 'public class ChatHub : Hub {\n    public async Task SendMessage(string user, string msg) {\n        await Clients.All.SendAsync("ReceiveMessage", user, msg);\n    }\n}',
        pitfalls: 'Storing state variables (like connection lists) directly in Hub instances. Hub classes are transient and recreated for every request.',
        questions: [
          { id: 'sig-hub-q1', question: 'What is an RPC in SignalR?', answer: 'Remote Procedure Call, allowing a client to call a server method or a server to invoke a client function.' },
          { id: 'sig-hub-q2', question: 'How is connection state maintained in Hubs?', answer: 'Hubs are stateless. State must be managed in external databases, memory caches, or services.' }
        ]
      },
      {
        id: 'sig-transports',
        title: 'Transports (WebSockets, SSE, Long Polling)',
        desc: 'Understand the three transports used by SignalR under the hood: WebSockets, Server-Sent Events, and Long Polling.',
        concepts: [
          { title: 'WebSockets', text: 'The only true full-duplex, persistent connection. Recommended for performance.' },
          { title: 'Server-Sent Events (SSE)', text: 'The server pushes updates over an HTTP connection; the client sends actions separately.' },
          { title: 'Long Polling', text: 'Standard HTTP requests held open by the server until data is ready.' }
        ],
        code: '// Client-side forcing specific transport type\nconst connection = new signalR.HubConnectionBuilder()\n    .withUrl("/chat", { transport: signalR.HttpTransportType.WebSockets })\n    .build();',
        pitfalls: 'Not configuring WebSockets on the hosting server, forcing the app to fall back to Long Polling and causing high connection load.',
        questions: [
          { id: 'sig-trans-q1', question: 'Why is WebSockets the preferred transport?', answer: 'Because it establishes a single, low-latency, full-duplex TCP connection, reducing HTTP overhead.' },
          { id: 'sig-trans-q2', question: 'When is Server-Sent Events used?', answer: 'When WebSockets are blocked but the browser supports persistent HTTP read streams.' }
        ]
      },
      {
        id: 'sig-lifecycles',
        title: 'Connection Lifecycles & State Management',
        desc: 'Manage connections as they connect, disconnect, or drop, and track connection IDs.',
        concepts: [
          { title: 'OnConnectedAsync', text: 'Event handler triggered when a new client connects.' },
          { title: 'OnDisconnectedAsync', text: 'Event handler triggered when a client disconnects.' },
          { title: 'ConnectionId', text: 'A unique string identifier assigned to each connection.' }
        ],
        code: 'public override async Task OnConnectedAsync() {\n    string id = Context.ConnectionId;\n    // Log or track connection\n    await base.OnConnectedAsync();\n}',
        pitfalls: 'Assuming ConnectionId is permanent. It resets whenever a client reconnects or refreshes the page.',
        questions: [
          { id: 'sig-life-q1', question: 'How do you detect when a user disconnects in SignalR?', answer: 'By overriding the OnDisconnectedAsync(Exception ex) method in the Hub class.' },
          { id: 'sig-life-q2', question: 'Does a page refresh preserve the ConnectionId?', answer: 'No, a page refresh terminates the old connection and creates a new one with a different ConnectionId.' }
        ]
      },
      {
        id: 'sig-targets',
        title: 'Message Targets (All, User, Groups, Caller)',
        desc: 'Route messages to target audiences: all clients, a specific user, groups, or back to the caller.',
        concepts: [
          { title: 'Clients.All', text: 'Sends messages to all connected clients.' },
          { title: 'Clients.User', text: 'Sends messages to a specific user based on user identity claims.' },
          { title: 'Clients.Groups', text: 'Sends messages to custom named categories.' }
        ],
        code: 'public async Task AlertGroup(string group) {\n    await Clients.Group(group).SendAsync("ShowAlert", "System Update");\n}',
        pitfalls: 'Sending sensitive messages to Clients.All, risking data exposure to unauthorized clients.',
        questions: [
          { id: 'sig-targ-q1', question: 'How does Clients.User differ from Clients.Client?', answer: 'Clients.Client targets a single ConnectionId. Clients.User targets all connections associated with a user\'s login name/claims.' },
          { id: 'sig-targ-q2', question: 'How do you target only the client who called the method?', answer: 'Use the Clients.Caller property inside the Hub method.' }
        ]
      },
      {
        id: 'sig-groups',
        title: 'Group Management',
        desc: 'Add and remove connection IDs dynamically into named logical groups to filter messages.',
        concepts: [
          { title: 'Groups.AddToGroupAsync', text: 'Adds a connection ID to a specific named group.' },
          { title: 'Groups.RemoveFromGroupAsync', text: 'Removes a connection ID from a group.' },
          { title: 'No persisting', text: 'Group memberships are not stored. If a connection drops, membership is lost.' }
        ],
        code: 'public async Task JoinRoom(string roomName) {\n    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);\n}',
        pitfalls: 'Assuming group members persist during reconnections. When a client reconnects, you must re-add them to their groups.',
        questions: [
          { id: 'sig-grp-q1', question: 'Are SignalR groups stored in a database?', answer: 'No, group memberships are managed in-memory by default. You must re-assign groups upon client reconnection.' },
          { id: 'sig-grp-q2', question: 'Can you list all members of a group in SignalR?', answer: 'No, there is no built-in API to list members for security and scalability reasons. You must track memberships in your own service.' }
        ]
      },
      {
        id: 'sig-react-integration',
        title: 'Client-Side Integration (React Setup)',
        desc: 'Establish and manage connections in a React frontend using the @microsoft/signalr npm library.',
        concepts: [
          { title: 'HubConnectionBuilder', text: 'Configure and initialize the backend endpoint connection.' },
          { title: 'connection.on', text: 'Register listener handlers to receive server commands.' },
          { title: 'withAutomaticReconnect', text: 'Ensures the client tries to reconnect if the connection drops.' }
        ],
        code: 'import { HubConnectionBuilder } from "@microsoft/signalr";\n\nconst conn = new HubConnectionBuilder()\n    .withUrl("https://localhost:5001/chat")\n    .withAutomaticReconnect()\n    .build();\nawait conn.start();',
        pitfalls: 'Calling connection.start() on every React component re-render, creating duplicate connections and slowing the browser.',
        questions: [
          { id: 'sig-react-q1', question: 'How do you register message listeners in the JS client?', answer: 'Use connection.on("MethodName", (args) => { ... }) after building the connection.' },
          { id: 'sig-react-q2', question: 'What does withAutomaticReconnect() do?', answer: 'It automatically attempts to reconnect using standard delay intervals if the connection drops.' }
        ]
      },
      {
        id: 'sig-auth-security',
        title: 'Authentication & Security in SignalR',
        desc: 'Secure SignalR hubs using JWT authorization headers or cookies, and validate connection access.',
        concepts: [
          { title: 'Authorize Attribute', text: 'Enforcing login rules on hubs ([Authorize]).' },
          { title: 'JWT Query String', text: 'Browsers do not support headers in WebSockets, so tokens must pass in query strings.' },
          { title: 'CORS rules', text: 'Configuring allowed client origins in the backend API.' }
        ],
        code: '[Authorize]\npublic class SecureHub : Hub {\n    // Only authenticated users can call methods\n}',
        pitfalls: 'Forgetting to register the query string token reader in the JWT authentication options in Program.cs.',
        questions: [
          { id: 'sig-sec-q1', question: 'How do you pass a JWT token to a WebSocket connection?', answer: 'Configure the client to pass the token as an access token in the query string, and configure the server to read it from the query string.' },
          { id: 'sig-sec-q2', question: 'Can you authorize individual methods on a Hub?', answer: 'Yes, by applying the [Authorize] attribute to specific hub methods.' }
        ]
      },
      {
        id: 'sig-scaling',
        title: 'Multi-Server Scaling & Backplanes (Redis, Azure)',
        desc: 'Scale SignalR apps across multiple servers using a Redis backplane or Azure SignalR Service.',
        concepts: [
          { title: 'Scaleout challenge', text: 'Clients on server A will not receive messages sent by clients on server B.' },
          { title: 'Redis Backplane', text: 'Publishes messages across all app servers using Redis.' },
          { title: 'Azure SignalR Service', text: 'Offloads connection management to a managed service.' }
        ],
        code: '// In Program.cs (Redis scaleout)\nbuilder.Services.AddSignalR()\n    .AddStackExchangeRedis("localhost:6379");',
        pitfalls: 'Not configuring sticky sessions in load balancers when using multiple servers without a backplane.',
        questions: [
          { id: 'sig-scale-q1', question: 'Why is a Backplane needed for multiple servers?', answer: 'To broadcast messages sent to one server across all servers, ensuring all connected clients receive it.' },
          { id: 'sig-scale-q2', question: 'What is Azure SignalR Service?', answer: 'A fully managed service that handles connection scale-out, offloading connection management from your app servers.' }
        ]
      },
      {
        id: 'sig-resilience',
        title: 'Resilience, Handshakes & Reconnection',
        desc: 'Handle handshakes and reconnection states to ensure reliable communication.',
        concepts: [
          { title: 'Connection Handshake', text: 'The initial request to negotiate protocols and serialization format.' },
          { title: 'Automatic Reconnection', text: 'Attempts to reconnect immediately, and then at increasing intervals.' },
          { title: 'Ping Messages', text: 'Periodic messages exchanged between client and server to keep the connection alive.' }
        ],
        code: 'connection.onreconnected(connectionId => {\n    console.log("Connection restored. New ID: " + connectionId);\n});',
        pitfalls: 'Not handling onreconnecting and onreconnected events in the UI, leaving the user unaware of connection drops.',
        questions: [
          { id: 'sig-res-q1', question: 'What happens during a SignalR handshake?', answer: 'The client and server exchange a negotiation request to choose the transport protocol and formatting (JSON/MessagePack).' },
          { id: 'sig-res-q2', question: 'How do you detect when a client is trying to reconnect?', answer: 'By subscribing to the connection.onreconnecting event handler in the client.' }
        ]
      },
      {
        id: 'sig-streaming',
        title: 'Streaming (Server & Client)',
        desc: 'Stream data from the server to the client (or client to server) to handle large data sets in real-time.',
        concepts: [
          { title: 'Server-to-Client Streaming', text: 'The server sends data chunks sequentially using IAsyncEnumerable.' },
          { title: 'Client-to-Server Streaming', text: 'The client streams chunks to the server using ChannelReader.' },
          { title: 'Performance', text: 'Saves memory by avoiding loading large datasets into a single message.' }
        ],
        code: 'public async IAsyncEnumerable<int> Counter(int count) {\n    for (int i = 0; i < count; i++) {\n        await Task.Delay(1000);\n        yield return i; // Streams numbers one by one\n    }\n}',
        pitfalls: 'Loading an entire collection in memory before yielding it in a streaming method, which defeats the purpose of streaming.',
        questions: [
          { id: 'sig-stream-q1', question: 'What C# return type enables server-to-client streaming?', answer: 'IAsyncEnumerable<T> or ChannelReader<T>.' },
          { id: 'sig-stream-q2', question: 'When should you use streaming in SignalR?', answer: 'When transferring large data sets (like file chunks or live reports) that should be rendered incrementally.' }
        ]
      },
      {
        id: 'sig-monitoring',
        title: 'Monitoring, Hub Filters & Diagnostics',
        desc: 'Monitor connection metrics and log hub execution times using Hub Filters.',
        concepts: [
          { title: 'Hub Filters', text: 'Interceptors that run before or after hub method execution.' },
          { title: 'Logging', text: 'Configure SignalR log levels in appsettings.json.' },
          { title: 'Performance metrics', text: 'Tracking active connections, request counts, and execution latency.' }
        ],
        code: 'public class LogFilter : IHubFilter {\n    public async ValueTask<object> InvokeMethodAsync(\n        HubInvocationContext context, Func<HubInvocationContext, ValueTask<object>> next) {\n        Console.WriteLine($"Calling hub method: {context.HubMethodName}");\n        return await next(context);\n    }\n}',
        pitfalls: 'Adding blocking operations inside Hub Filters, which slows down all connection communication.',
        questions: [
          { id: 'sig-mon-q1', question: 'What is a Hub Filter?', answer: 'An interceptor that runs before and after a Hub method is called, allowing you to log or validate requests.' },
          { id: 'sig-mon-q2', question: 'How do you monitor connection count in SignalR?', answer: 'By tracking connection events in OnConnectedAsync and OnDisconnectedAsync, or using performance counters.' }
        ]
      }
    ]
  },
  'microservices': {
    name: 'Microservices',
    topics: [
      {
        id: 'ms-mono-vs-micro',
        title: 'Monolithic vs Microservices Architecture',
        desc: 'Compare building a single combined application (Monolithic) with distributing features across independent, modular services (Microservices).',
        concepts: [
          { title: 'Monolith', text: 'All modules are built, deployed, and scaled together in a single code base.' },
          { title: 'Microservices', text: 'Autonomous services organized around business capabilities, with their own databases.' },
          { title: 'Independent Deployment', text: 'Services can be updated individually without redeploying the whole system.' }
        ],
        code: '// Monolith: Shared in-memory service calls\nvar data = orderService.GetOrderDetails(id);\n\n// Microservices: HTTP or gRPC cross-network call\nvar data = await httpClient.GetFromJsonAsync<Order>($"http://order-service/api/orders/{id}");',
        pitfalls: 'Adopting microservices too early for simple projects. The operational complexity of service discovery, networks, and logging can outweigh the benefits.',
        questions: [
          { id: 'ms-mono-q1', question: 'What is the main advantage of microservices over a monolith?', answer: 'Independent deployability, allowing teams to develop, scale, and deploy services without affecting the rest of the application.' },
          { id: 'ms-mono-q2', question: 'What is a distributed monolith?', answer: 'An anti-pattern where services are separated but tightly coupled through synchronous calls, failing to achieve independent deployment.' }
        ]
      },
      {
        id: 'ms-characteristics',
        title: 'Characteristics of Microservices',
        desc: 'Review the defining features of microservices, including domain-driven design, smart endpoints, and database-per-service.',
        concepts: [
          { title: 'Domain-Driven Design', text: 'Services align with distinct business boundaries.' },
          { title: 'Database-per-Service', text: 'Each service owns its own database, preventing shared schema dependencies.' },
          { title: 'Smart endpoints, dumb pipes', text: 'Services process business logic; the network pipes only route messages.' }
        ],
        code: '// OrderService DB: OrderTables, OrderItems (SQL Server)\n// CatalogService DB: ProductCatalog, Categories (MongoDB)',
        pitfalls: 'Sharing a database database instance between two microservices, which creates schema coupling and invalidates service autonomy.',
        questions: [
          { id: 'ms-char-q1', question: 'Why is "Database-per-Service" a rule in microservices?', answer: 'To ensure data isolation, allowing each service to use its own database type and evolve its schema independently without breaking other services.' },
          { id: 'ms-char-q2', question: 'What does "smart endpoints, dumb pipes" mean?', answer: 'The routing network (like RabbitMQ or HTTP) is simple and does not contain business logic; all logic lives inside the services.' }
        ]
      },
      {
        id: 'ms-ddd-bounded',
        title: 'DDD, Bounded Contexts & Ubiquitous Language',
        desc: 'Use Domain-Driven Design (DDD) to identify bounded contexts and ubiquitous languages to guide microservice boundaries.',
        concepts: [
          { title: 'Bounded Context', text: 'A boundary within which a domain model is defined and valid.' },
          { title: 'Ubiquitous Language', text: 'A shared vocabulary used by both developers and business experts to define domain models.' },
          { title: 'Context Mapping', text: 'Defining how different bounded contexts interact and share data.' }
        ],
        code: '// Bounded Context: Ordering\npublic class Customer { public int Id; public List<Order> Orders; }\n\n// Bounded Context: Identity\npublic class User { public int Id; public string PasswordHash; }',
        pitfalls: 'Creating a single unified "User" or "Customer" model shared across all microservices, which couples different business areas.',
        questions: [
          { id: 'ms-ddd-q1', question: 'What is a Bounded Context?', answer: 'A boundary within which a specific domain model applies, clarifying model terminology (e.g. User vs Customer).' },
          { id: 'ms-ddd-q2', question: 'Why is a Ubiquitous Language important?', answer: 'It aligns technical code models with business terminology, reducing translation errors and communication gaps.' }
        ]
      },
      {
        id: 'ms-db-patterns',
        title: 'Database-per-Service vs Shared Database',
        desc: 'Contrast database encapsulation with shared schema patterns, and analyze schema coupling.',
        concepts: [
          { title: 'Encapsulation', text: 'Services expose data only through APIs, never through direct database access.' },
          { title: 'Polyglot Persistence', text: 'Choosing the best database type (SQL, NoSQL, graph) for each service.' },
          { title: 'Data replication', text: 'Duplicating lookup data to reduce cross-service queries.' }
        ],
        code: '// OrderService queries Customer details from CustomerService via API\n// instead of query JOIN Customer database tables directly.',
        pitfalls: 'Writing SQL Joins across databases of different services, which violates encapsulation and breaks boundaries.',
        questions: [
          { id: 'ms-db-q1', question: 'What is Polyglot Persistence?', answer: 'The practice of using multiple database storage technologies within an application based on service needs.' },
          { id: 'ms-db-q2', question: 'How do you handle reporting across database-per-service architectures?', answer: 'By streaming database changes (CDC) or events to a centralized Data Lake or Data Warehouse.' }
        ]
      },
      {
        id: 'ms-comm-sync-async',
        title: 'Sync (gRPC/HTTP) vs Async (Event-Driven/Kafka)',
        desc: 'Compare synchronous communication (blocking HTTP/gRPC calls) with asynchronous event-driven messaging (RabbitMQ/Kafka).',
        concepts: [
          { title: 'Synchronous (gRPC/HTTP)', text: 'Direct request-response calls. Easiest to write, but blocks threads and creates runtime dependency.' },
          { title: 'Asynchronous (Events)', text: 'Services publish event messages to a broker; subscribers react independently. Non-blocking.' },
          { title: 'gRPC benefits', text: 'Uses HTTP/2 and protocol buffers for fast, compact binary communication.' }
        ],
        code: '// Publishing an integration event to RabbitMQ\nvar orderEvent = new OrderCreatedEvent(order.Id);\nawait eventBus.PublishAsync(orderEvent);',
        pitfalls: 'Chaining synchronous HTTP calls (A calls B, B calls C, C calls D), which amplifies latency and introduces multiple points of failure.',
        questions: [
          { id: 'ms-comm-q1', question: 'Why is asynchronous communication preferred in microservices?', answer: 'It decouples services, preventing a failure in one service from crashing the caller, and improves performance.' },
          { id: 'ms-comm-q2', question: 'When is gRPC preferred over REST/JSON?', answer: 'For service-to-service internal communication where low latency, high throughput, and strong API contracts are needed.' }
        ]
      },
      {
        id: 'ms-gateway-bff',
        title: 'API Gateway & BFF (Backend for Frontend)',
        desc: 'Implement API Gateways to route requests, manage security, and create custom backends for specific frontend client types.',
        concepts: [
          { title: 'API Gateway', text: 'A proxy server acting as the single entry point, routing requests to target microservices.' },
          { title: 'BFF Pattern', text: 'Creating separate gateway backends for different clients (e.g. mobile app vs web app).' },
          { title: 'Cross-cutting concerns', text: 'Offloading SSL handshakes, rate limiting, and authorization to the gateway.' }
        ],
        code: '// Web BFF routes to: OrderService /api/orders\n// Mobile BFF routes to: OrderService /api/m/orders (with smaller payload)',
        pitfalls: 'Adding complex business logic inside the API Gateway, converting it into a monolithic bottleneck.',
        questions: [
          { id: 'ms-gate-q1', question: 'What is the Backend for Frontend (BFF) pattern?', answer: 'A pattern where you create separate API Gateways tailored to the specific needs of different client applications (web, mobile).' },
          { id: 'ms-gate-q2', question: 'Name three concerns offloaded to an API Gateway.', answer: 'SSL termination, authentication/authorization, and rate limiting/throttling.' }
        ]
      },
      {
        id: 'ms-discovery-registry',
        title: 'Service Discovery & Dynamic Registries',
        desc: 'Solve service address routing challenges in dynamic cloud environments using Service Registry and Discovery.',
        concepts: [
          { title: 'Service Registry', text: 'A database of active service instance IPs and ports.' },
          { title: 'Dynamic Registration', text: 'Instances register their addresses on startup and send health checks.' },
          { title: 'Client-side discovery', text: 'The client queries the registry to resolve service addresses.' }
        ],
        code: '// Consul Service Registration config in C#\nvar consulClient = new ConsulClient(c => c.Address = new Uri("http://consul:8500"));\nawait consulClient.Agent.ServiceRegister(registration);',
        pitfalls: 'Not configuring container health checks in the registry, leading to traffic being routed to crashed containers.',
        questions: [
          { id: 'ms-disc-q1', question: 'What is Service Discovery?', answer: 'A mechanism that allows services to automatically detect and connect to other service instances in a dynamic environment.' },
          { id: 'ms-disc-q2', question: 'What is the role of Consul or Eureka?', answer: 'They act as centralized service registries where instances register on startup and verify health.' }
        ]
      },
      {
        id: 'ms-transactions-saga',
        title: 'Distributed Transactions & Saga Pattern',
        desc: 'Maintain data consistency across multiple databases without 2PC (Two-Phase Commit) using the Saga Pattern.',
        concepts: [
          { title: 'Saga Pattern', text: 'A sequence of local transactions across services. Each step publishes an event.' },
          { title: 'Compensating Transaction', text: 'Undo actions executed to roll back database changes if a subsequent step fails.' },
          { title: 'Choreography vs Orchestration', text: 'Choreography is decentralized (event-based). Orchestration uses a central coordinator.' }
        ],
        code: '// Saga Orchestrator steps:\n// 1. CreateOrderPending\n// 2. AuthorizeCardPayment\n// 3. (If payment fails) -> Rollback: CancelOrderPending (Compensating)',
        pitfalls: 'Implementing Sagas without verifying that compensating steps are idempotent (can be run multiple times safely).',
        questions: [
          { id: 'ms-saga-q1', question: 'What is a compensating transaction?', answer: 'An action executed to undo the effects of a previous transaction step in a Saga if the workflow fails.' },
          { id: 'ms-saga-q2', question: 'What is the difference between Choreography and Orchestration in Sagas?', answer: 'Choreography relies on services listening to events independently. Orchestration uses a central manager class to coordinate execution steps.' }
        ]
      },
      {
        id: 'ms-cqrs-event-sourcing',
        title: 'CQRS & Event Sourcing Patterns',
        desc: 'Implement Command Query Responsibility Segregation (CQRS) and store application state as a sequence of events.',
        concepts: [
          { title: 'CQRS', text: 'Separates write models (Commands) from read models (Queries) to optimize performance.' },
          { title: 'Event Sourcing', text: 'Stores state changes as an immutable sequence of events instead of just the current record state.' },
          { title: 'Read Materialization', text: 'Replaying events to build read models in database caches.' }
        ],
        code: '// Event Sourcing model\nvar events = new List<Event> {\n    new AccountCreatedEvent(id, 100),\n    new MoneyDepositedEvent(id, 50),\n    new MoneyWithdrawnEvent(id, 20)\n}; // Current Balance (130) is rebuilt by replaying events',
        pitfalls: 'Adopting Event Sourcing for simple domain models, which introduces high complexity for basic operations.',
        questions: [
          { id: 'ms-cqrs-q1', question: 'What is CQRS?', answer: 'Command Query Responsibility Segregation, a pattern that separates read and write operations into distinct database models.' },
          { id: 'ms-cqrs-q2', question: 'What is Event Sourcing?', answer: 'Storing application state as a sequence of immutable events rather than overwriting database records.' }
        ]
      },
      {
        id: 'ms-fault-tolerance',
        title: 'Fault Tolerance (Circuit Breakers, Bulkheads)',
        desc: 'Prevent cascading failures across services using Retries, Timeout thresholds, Circuit Breakers, and Bulkheads.',
        concepts: [
          { title: 'Circuit Breaker', text: 'Trips open when a service fails repeatedly, preventing subsequent calls and failing fast.' },
          { title: 'Bulkhead Isolation', text: 'Limits resources (like threads) allocated to specific calls to prevent resource exhaustion.' },
          { title: 'Polly Library', text: 'A popular .NET library for implementing resilience patterns.' }
        ],
        code: 'var breakerPolicy = Policy\n    .Handle<HttpRequestException>()\n    .CircuitBreakerAsync(exceptionsAllowedBeforeBreaking: 3, durationOfBreak: TimeSpan.FromSeconds(30));',
        pitfalls: 'Configuring infinite retry policies without backing off, which creates a denial of service (DoS) effect on failing databases.',
        questions: [
          { id: 'ms-fault-q1', question: 'What are the three states of a Circuit Breaker?', answer: 'Closed (traffic flows), Open (calls fail instantly), and Half-Open (sends trial requests to check recovery).' },
          { id: 'ms-fault-q2', question: 'What is a Bulkhead pattern?', answer: 'An isolation pattern that limits maximum thread pool or resource usage for specific service paths to prevent total system freeze.' }
        ]
      },
      {
        id: 'ms-logs-observability',
        title: 'Centralized Logs & Observability',
        desc: 'Track user requests across distributed services using Correlation IDs, centralized logs, and distributed tracing.',
        concepts: [
          { title: 'Correlation ID', text: 'A unique ID passed in HTTP headers to trace requests across services.' },
          { title: 'Distributed Tracing', text: 'Measuring execution latency across multiple services (Jaeger, OpenTelemetry).' },
          { title: 'Centralized Logging', text: 'Streaming log outputs from all containers to a single searchable dashboard (ELK).' }
        ],
        code: '// Setting correlation ID header in C# HTTP client\nclient.DefaultRequestHeaders.Add("X-Correlation-ID", correlationId);',
        pitfalls: 'Not logging Correlation IDs, which makes debugging requests across multiple services impossible.',
        questions: [
          { id: 'ms-obs-q1', question: 'What is a Correlation ID?', answer: 'A unique identifier passed between microservice calls to link logs from different systems to a single user action.' },
          { id: 'ms-obs-q2', question: 'What is OpenTelemetry?', answer: 'An open-source standard for generating, collecting, and exporting logs, metrics, and traces from distributed apps.' }
        ]
      },
      {
        id: 'ms-containers-k8s',
        title: 'Containers and Kubernetes Orchestration',
        desc: 'Understand how Docker and Kubernetes are used to package, deploy, and scale microservices.',
        concepts: [
          { title: 'Containerization', text: 'Bundling each microservice into a Docker image.' },
          { title: 'Kubernetes Pods', text: 'The smallest deployable unit in Kubernetes, containing one or more containers.' },
          { title: 'Declarative Scaling', text: 'Defining replica counts in YAML files to scale instances automatically.' }
        ],
        code: '// Kubernetes deployment yaml snippet\n# spec:\n#   replicas: 3\n#   template:\n#     spec:\n#       containers:\n#       - name: order-service',
        pitfalls: 'Treating Kubernetes pods as permanent servers, forgetting that pods are temporary and can be destroyed at any time.',
        questions: [
          { id: 'ms-k8s-q1', question: 'What is a Kubernetes Pod?', answer: 'The basic execution unit in Kubernetes, grouping containers that share storage and network settings.' },
          { id: 'ms-k8s-q2', question: 'Why is container orchestration necessary for microservices?', answer: 'To automate deployment, load balancing, scaling, health monitoring, and networking across multiple service instances.' }
        ]
      },
      {
        id: 'ms-cicd',
        title: 'Microservices CI/CD Pipelines',
        desc: 'Build, test, and deploy microservices independently using CI/CD pipelines.',
        concepts: [
          { title: 'Continuous Integration', text: 'Automating code builds and testing on every pull request.' },
          { title: 'Continuous Deployment', text: 'Automatically deploying passing builds to staging or production.' },
          { title: 'Blue-Green Deployment', text: 'Deploying updates to a duplicate environment and switching traffic to prevent downtime.' }
        ],
        code: '// GitHub Actions workflow snippet\n# - name: Build and Push Docker Image\n#   run: |\n#     docker build -t myacr.azurecr.io/orderservice:${{ github.sha }} .\n#     docker push myacr.azurecr.io/orderservice:${{ github.sha }}',
        pitfalls: 'Building a single monolithic deployment pipeline that builds all microservices on every change, instead of pipeline isolation.',
        questions: [
          { id: 'ms-cicd-q1', question: 'Why should microservices have separate CI/CD pipelines?', answer: 'To allow each service to be built, tested, and deployed independently without affecting other services.' },
          { id: 'ms-cicd-q2', question: 'What is Canary Deployment?', answer: 'A release strategy where updates are deployed to a small percentage of users first to check stability before full rollout.' }
        ]
      },
      {
        id: 'ms-security-oauth2',
        title: 'Gateway Security (OAuth2, OIDC)',
        desc: 'Secure microservices using OAuth2 token verification and OpenID Connect (OIDC) protocols.',
        concepts: [
          { title: 'Token Verification', text: 'Microservices validate incoming JWT signatures using public keys.' },
          { title: 'Identity Provider (IdP)', text: 'Central service (Keycloak, Auth0) that handles authentication and issues tokens.' },
          { title: 'Scope checking', text: 'Verifying token claims (e.g. read:orders) inside API controllers.' }
        ],
        code: '[Authorize(Policy = "RequireReadScope")]\n[HttpGet("{id}")]\npublic IActionResult GetOrder(int id) => Ok();',
        pitfalls: 'Validating JWT signatures by calling the Identity Provider database on every microservice request, which hurts performance.',
        questions: [
          { id: 'ms-sec-q1', question: 'How do microservices validate JWT tokens without contacting the Auth server?', answer: 'They validate tokens in memory by checking the signature against the Auth server\'s public key (using JWKS).' },
          { id: 'ms-sec-q2', question: 'What is the role of an Identity Provider (IdP)?', answer: 'A central service that authenticates users and issues tokens containing identity claims.' }
        ]
      }
    ]
  },
  'docker': {
    name: 'Docker & Containers',
    topics: [
      {
        id: 'doc-intro',
        title: 'Virtualization vs Containerization',
        desc: 'Understand the difference between virtualizing physical hardware (Virtual Machines) and isolating applications using the host OS kernel (Docker).',
        concepts: [
          { title: 'Hypervisor', text: 'Virtualizes hardware, requiring a complete guest OS for each VM.' },
          { title: 'Docker Engine', text: 'Containers share the host OS kernel, running as isolated processes.' },
          { title: 'Resource overhead', text: 'VMs use gigabytes of memory and take minutes to boot; containers start in seconds.' }
        ],
        code: 'Virtual Machine: [Hardware] -> [Hypervisor] -> [Guest OS] -> [App]\nDocker Container: [Hardware] -> [Host OS] -> [Docker Engine] -> [App]',
        pitfalls: 'Treating Docker containers like Virtual Machines by keeping them running permanently and editing files directly inside them.',
        questions: [
          { id: 'doc-intro-q1', question: 'Why are containers more lightweight than VMs?', answer: 'Because containers share the host operating system kernel instead of booting a complete guest OS.' },
          { id: 'doc-intro-q2', question: 'What is the role of the Docker daemon?', answer: 'It manages Docker images, containers, networks, and storage volumes on the host system.' }
        ]
      },
      {
        id: 'doc-engine',
        title: 'Docker Engine Architecture',
        desc: 'Explore the internal components of the Docker Engine: Daemon, REST API, Client, and registries.',
        concepts: [
          { title: 'Docker Client (CLI)', text: 'The command-line interface used to send commands to the daemon.' },
          { title: 'Docker Daemon (dockerd)', text: 'The background process that builds, runs, and manages containers.' },
          { title: 'Containerd', text: 'The low-level container runtime that manages container lifecycles.' }
        ],
        code: 'Client (docker run) ──(REST API)──> Daemon (dockerd) ──> containerd ──> runc ──> Container',
        pitfalls: 'Running the Docker daemon without security access limits, which can expose root access on the host system.',
        questions: [
          { id: 'doc-eng-q1', question: 'What is dockerd?', answer: 'The background daemon process that manages container lifecycles, images, networks, and storage.' },
          { id: 'doc-eng-q2', question: 'What is containerd?', answer: 'An industry-standard container runtime used by Docker to manage container execution.' }
        ]
      },
      {
        id: 'doc-install-config',
        title: 'Installation & Configuration',
        desc: 'Configure Docker Desktop, allocate CPU/RAM limits, and configure proxy connections.',
        concepts: [
          { title: 'Docker Desktop', text: 'GUI application providing container runtimes on Windows and macOS.' },
          { title: 'WSL 2 Backend', text: 'Integrates Docker on Windows using Windows Subsystem for Linux.' },
          { title: 'Resource Limits', text: 'Setting CPU, memory, and swap space allocations for container execution.' }
        ],
        code: '# Allocating memory limits in docker-compose or run commands\ndocker run -m 512m --cpus="1.5" nginx',
        pitfalls: 'Not setting container memory limits, allowing a memory leak in a container to exhaust host RAM and crash the host OS.',
        questions: [
          { id: 'doc-inst-q1', question: 'Why is WSL 2 preferred for Docker on Windows?', answer: 'It provides faster compilation, performance, and compatibility compared to older Hyper-V architectures.' },
          { id: 'doc-inst-q2', question: 'How do you check current resource allocations in Docker?', answer: 'By executing "docker info" or using Docker Desktop settings.' }
        ]
      },
      {
        id: 'doc-cli-essentials',
        title: 'CLI Essentials (run, build, exec, logs)',
        desc: 'Master the core Docker commands to build images, run containers, inspect logs, and execute terminal commands.',
        concepts: [
          { title: 'docker build', text: 'Compiles a Dockerfile into an executable container image.' },
          { title: 'docker run', text: 'Instantiates and runs a container from an image, mapping ports.' },
          { title: 'docker exec', text: 'Runs a terminal command inside an already running container.' }
        ],
        code: 'docker build -t my-web-app .\ndocker run -d -p 8080:80 --name web my-web-app\ndocker exec -it web sh\ndocker logs web',
        pitfalls: 'Using docker run repeatedly to restart stopped containers, which creates duplicate container instances instead of using docker start.',
        questions: [
          { id: 'doc-cli-q1', question: 'What is the difference between docker run and docker start?', answer: 'docker run creates and starts a new container instance. docker start boots an already existing stopped container.' },
          { id: 'doc-cli-q2', question: 'What does the -it flag do in docker exec?', answer: 'It enables interactive mode and allocates a pseudo-TTY terminal, allowing you to interact with the container shell.' }
        ]
      },
      {
        id: 'doc-images-layers',
        title: 'Images, Layers & Cache',
        desc: 'Understand Docker image layer caching and write instructions that utilize caching for faster builds.',
        concepts: [
          { title: 'Read-Only Layers', text: 'Images consist of stacked, read-only filesystem layers.' },
          { title: 'Build Cache', text: 'Docker reuse unchanged layers to speed up compilation.' },
          { title: 'Union File System', text: 'Combines all layers into a single cohesive file system view.' }
        ],
        code: '# Each line in a Dockerfile creates a new layer\n# Placing frequently changed lines (COPY source) at the bottom\n# allows cached dependency restores (RUN dotnet restore) to remain valid.',
        pitfalls: 'Changing files that are copied early in the Dockerfile, which invalidates the cache for all subsequent steps and slows down builds.',
        questions: [
          { id: 'doc-lay-q1', question: 'How does Docker build caching work?', answer: 'Docker checks if the instructions and files in a step match previous builds; if so, it reuses the cached layer instead of running the command again.' },
          { id: 'doc-lay-q2', question: 'What happens to layers when you modify a Dockerfile line?', answer: 'The cache for that modified line and all subsequent lines is invalidated, forcing those steps to rebuild.' }
        ]
      },
      {
        id: 'doc-dockerfile',
        title: 'Writing a Dockerfile',
        desc: 'Learn the core instructions to write clean Dockerfiles: FROM, WORKDIR, COPY, RUN, EXPOSE, CMD, and ENTRYPOINT.',
        concepts: [
          { title: 'FROM / WORKDIR', text: 'Selects the base image and configures the working directory.' },
          { title: 'RUN vs CMD', text: 'RUN executes commands at build time. CMD defines default runtime commands.' },
          { title: 'ENTRYPOINT', text: 'Defines the main executable binary file run when the container starts.' }
        ],
        code: 'FROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY ./publish .\nENTRYPOINT ["dotnet", "MyAPI.dll"]',
        pitfalls: 'Using RUN to start applications, not understanding that RUN commands run only at compile time and are baked into the image.',
        questions: [
          { id: 'doc-df-q1', question: 'What is the difference between RUN and CMD?', answer: 'RUN runs commands during image build (creating layers). CMD defines the default command executed when the container starts.' },
          { id: 'doc-df-q2', question: 'How do CMD and ENTRYPOINT interact?', answer: 'ENTRYPOINT defines the executable. CMD acts as default arguments passed to that executable.' }
        ]
      },
      {
        id: 'doc-multistage',
        title: 'Multi-Stage Build Configurations',
        desc: 'Create small production images by separating build-time SDK packages from runtime environments.',
        concepts: [
          { title: 'Build-time dependencies', text: 'Using full compilers (like .NET SDK or npm) to compile code in a temporary stage.' },
          { title: 'Runtime base images', text: 'Deploying compiled output to lightweight runtime images (like Alpine or aspnet-runtime).' },
          { title: 'COPY --from', text: 'Copying compiled files between build stages.' }
        ],
        code: 'FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-stage\nWORKDIR /src\nCOPY . .\nRUN dotnet publish -c Release -o /app/out\n\nFROM mcr.microsoft.com/dotnet/aspnet:8.0\nWORKDIR /app\nCOPY --from=build-stage /app/out .',
        pitfalls: 'Including SDK layers in production images, resulting in large image sizes and security vulnerabilities.',
        questions: [
          { id: 'doc-multi-q1', question: 'Why are multi-stage builds recommended for production?', answer: 'They reduce the final image size and improve security by omitting build tools, compilers, and source code.' },
          { id: 'doc-multi-q2', question: 'What does the AS keyword do in FROM statements?', answer: 'It assigns a name to a build stage, allowing it to be referenced in subsequent COPY --from commands.' }
        ]
      },
      {
        id: 'doc-volumes',
        title: 'Volumes & Persistent Storage',
        desc: 'Persist container data beyond container lifetimes using Named Volumes, Bind Mounts, and tmpfs.',
        concepts: [
          { title: 'Ephemerality', text: 'Container files are destroyed if the container is deleted.' },
          { title: 'Named Volumes', text: 'Storage areas managed by Docker on the host disk. Best for databases.' },
          { title: 'Bind Mounts', text: 'Mapping a specific folder from the host computer into a container.' }
        ],
        code: 'docker run -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres\n# Maps named volume pgdata to postgres data directory',
        pitfalls: 'Storing database records inside the container filesystem without mounting a volume, resulting in total data loss when the container is deleted.',
        questions: [
          { id: 'doc-vol-q1', question: 'What is the difference between a volume and a bind mount?', answer: 'Volumes are managed by Docker. Bind mounts link to a specific path on the host system.' },
          { id: 'doc-vol-q2', question: 'What happens to volume data when a container is deleted?', answer: 'The volume data is preserved; it remains on the host disk and can be mounted to another container.' }
        ]
      },
      {
        id: 'doc-networking',
        title: 'Docker Networking Modes',
        desc: 'Configure communication between containers using networking modes: Bridge, Host, Overlay, and None.',
        concepts: [
          { title: 'Bridge Network', text: 'The default network. Containers communicate using container names as DNS names.' },
          { title: 'Host Network', text: 'Bypasses network isolation, mapping container ports directly to host ports.' },
          { title: 'Overlay Network', text: 'Enables communication between containers on different host computers (Swarm/K8s).' }
        ],
        code: 'docker network create my-bridge\ndocker run -d --name db --network my-bridge postgres\ndocker run -d --name web --network my-bridge -p 80:80 my-web-app',
        pitfalls: 'Attempting to make containers talk to each other using "localhost" instead of container names inside a custom network.',
        questions: [
          { id: 'doc-net-q1', question: 'How do containers resolve each other\'s IP addresses on a custom bridge network?', answer: 'Docker provides a built-in DNS service that resolves container names to their internal IPs.' },
          { id: 'doc-net-q2', question: 'What is the default network mode for Docker containers?', answer: 'The default network mode is Bridge.' }
        ]
      },
      {
        id: 'doc-compose',
        title: 'Docker Compose Multi-Container Orchestration',
        desc: 'Define and run multi-container applications (e.g. API + Database + Redis) using a single docker-compose.yml file.',
        concepts: [
          { title: 'docker-compose.yml', text: 'Declarative YAML file defining services, networks, and volumes.' },
          { title: 'Service dependencies', text: 'Configuring start order using the depends_on attribute.' },
          { title: 'CLI management', text: 'Managing the entire application stack using "docker-compose up -d".' }
        ],
        code: 'version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "5000:80"\n    depends_on:\n      - db\n  db:\n    image: postgres',
        pitfalls: 'Assuming depends_on waits for the database to be fully initialized and ready. It only waits for the database container process to start. You must implement retry logic in your application.',
        questions: [
          { id: 'doc-comp-q1', question: 'What is Docker Compose?', answer: 'A tool for defining and running multi-container Docker applications using a single YAML configuration file.' },
          { id: 'doc-comp-q2', question: 'How do you stop and remove all resources created by Docker Compose?', answer: 'By executing the "docker-compose down" command in the directory containing the compose file.' }
        ]
      },
      {
        id: 'doc-resources-monitoring',
        title: 'Resource Limits & Container Monitoring',
        desc: 'Monitor container performance, CPU utilization, and allocate runtime memory limits.',
        concepts: [
          { title: 'docker stats', text: 'CLI tool displaying real-time CPU, memory, network, and disk usage metrics.' },
          { title: 'Memory Limits', text: 'Restricting container RAM to prevent resource exhaustion.' },
          { title: 'CPU Pinning', text: 'Allocating specific CPU cores to high-priority containers.' }
        ],
        code: 'docker stats --no-stream # Returns instant container resource snapshot',
        pitfalls: 'Not monitoring container metrics in production, leaving memory leaks or deadlocked threads undetected.',
        questions: [
          { id: 'doc-res-q1', question: 'How do you check resource usage stats of running containers?', answer: 'By executing the "docker stats" command in the terminal.' },
          { id: 'doc-res-q2', question: 'What happens if a container exceeds its configured memory limit?', answer: 'The host system will terminate the container process using the Out Of Memory (OOM) killer.' }
        ]
      },
      {
        id: 'doc-registries',
        title: 'Image Registries (Docker Hub, ECR, ACR)',
        desc: 'Publish, version, and pull container images from public and private registries.',
        concepts: [
          { title: 'Docker Registry', text: 'A storage and hosting service for Docker images.' },
          { title: 'Image Tagging', text: 'Naming and versioning images (e.g. myimage:v1.2).' },
          { title: 'Private Registries', text: 'Authenticating with private cloud registries (AWS ECR, Azure ACR, GitHub Packages).' }
        ],
        code: 'docker tag myapp:latest myusername/myapp:v1.0\ndocker push myusername/myapp:v1.0',
        pitfalls: 'Pushing sensitive credentials (API keys, connection strings) inside pushed images, exposing them to anyone with image pull access.',
        questions: [
          { id: 'doc-reg-q1', question: 'What is a Docker Registry?', answer: 'A centralized service (like Docker Hub or Azure Container Registry) used to store and distribute Docker images.' },
          { id: 'doc-reg-q2', question: 'How do you version a Docker image during build?', answer: 'By appending a tag to the image name (e.g., myapp:1.0.0) using the -t flag.' }
        ]
      },
      {
        id: 'doc-security',
        title: 'Docker Security Policies',
        desc: 'Secure Docker environments by running containers as non-root users and scanning images for vulnerabilities.',
        concepts: [
          { title: 'Non-Root execution', text: 'Using the USER directive in Dockerfiles to prevent host system exploits.' },
          { title: 'Image Scanning', text: 'Scanning images for security vulnerabilities in dependencies.' },
          { title: 'Read-only container rootfs', text: 'Running containers with read-only filesystems to prevent hackers from saving scripts.' }
        ],
        code: '# Create non-root user in Dockerfile\nRUN useradd -u 8888 appuser\nUSER appuser\n# Container now executes safely as non-root user',
        pitfalls: 'Running database or web containers with host root privileges, which allows hackers to escape the container and compromise the host.',
        questions: [
          { id: 'doc-sec-q1', question: 'Why should you avoid running containers as root?', answer: 'Because if a hacker breaches the container application, they gain root access to the underlying host system.' },
          { id: 'doc-sec-q2', question: 'What does the USER directive do in a Dockerfile?', answer: 'It sets the username or UID to use when running subsequent image instructions and container runtime processes.' }
        ]
      },
      {
        id: 'doc-orchestration-intro',
        title: 'Orchestration (Docker Swarm / Kubernetes Intro)',
        desc: 'Introduction to orchestrating containers across clusters of host nodes using Swarm or Kubernetes.',
        concepts: [
          { title: 'Clustering', text: 'Grouping multiple virtual or physical machines into a single resource pool.' },
          { title: 'Declarative Scaling', text: 'Specifying the desired number of container replicas.' },
          { title: 'Rolling Updates', text: 'Updating container instances sequentially to prevent downtime.' }
        ],
        code: '# Deploying a service stack to Docker Swarm\ndocker stack deploy -c docker-compose.yml myapp',
        pitfalls: 'Designing stateful databases as replicas in clusters without configuring persistent distributed storage, leading to database synchronization errors.',
        questions: [
          { id: 'doc-orch-q1', question: 'What is the main purpose of a container orchestrator?', answer: 'To manage deployment, scaling, load balancing, and networking of containers across a cluster of host machines.' },
          { id: 'doc-orch-q2', question: 'Name two popular container orchestrators.', answer: 'Kubernetes and Docker Swarm.' }
        ]
      }
    ]
  },
  'sql-server': {
    name: 'SQL Server',
    topics: [
      {
        id: 'sql-intro-arch',
        title: 'RDBMS Concepts & SQL Server Architecture',
        desc: 'Understand relational database concepts, primary/foreign key mappings, and the SQL Server storage engine.',
        concepts: [
          { title: 'RDBMS', text: 'Relational Database Management System based on tables, columns, and relations.' },
          { title: 'SQL Server Engine', text: 'The database engine coordinating memory allocation, indexing, and query tasks.' },
          { title: 'Schemas', text: 'Namespace containers used to group related tables and procedures (e.g. dbo, sales).' }
        ],
        code: 'CREATE DATABASE TutorialDb;\nGO\nUSE TutorialDb;\nGO',
        pitfalls: 'Treating a relational database as a flat file system, creating massive tables with duplicated columns instead of normal relations.',
        questions: [
          { id: 'sql-arch-q1', question: 'What is an RDBMS?', answer: 'A relational database management system that organizes data into tables and enforces relationships using keys.' },
          { id: 'sql-arch-q2', question: 'What does GO signify in SQL Server scripts?', answer: 'It is a batch terminator utility command, telling SQL Server to execute previous statements together.' }
        ]
      },
      {
        id: 'sql-keys-schema',
        title: 'Schema, Tables, Primary & Foreign Keys',
        desc: 'Establish database tables, enforce integrity constraints, and map relations using primary and foreign keys.',
        concepts: [
          { title: 'Primary Key', text: 'A column (or columns) that uniquely identifies each row in a table. Cannot be null.' },
          { title: 'Foreign Key', text: 'A column that establishes a link to the primary key of another table, enforcing referential integrity.' },
          { title: 'Constraints', text: 'Rules enforced on columns like NOT NULL, UNIQUE, and CHECK.' }
        ],
        code: 'CREATE TABLE Departments (\n    Id INT PRIMARY KEY IDENTITY(1,1),\n    Name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE Employees (\n    Id INT PRIMARY KEY IDENTITY(1,1),\n    Name VARCHAR(100) NOT NULL,\n    DeptId INT FOREIGN KEY REFERENCES Departments(Id)\n);',
        pitfalls: 'Not defining foreign keys and relying purely on application-level checks, which leads to orphaned records in the database.',
        questions: [
          { id: 'sql-keys-q1', question: 'What is the purpose of a foreign key constraint?', answer: 'To maintain referential integrity between tables by ensuring a value in one table matches an existing value in another.' },
          { id: 'sql-keys-q2', question: 'What does the IDENTITY(1,1) specification do?', answer: 'It automatically generates unique auto-incrementing numbers for the column, starting at 1 and incrementing by 1.' }
        ]
      },
      {
        id: 'sql-querying-essentials',
        title: 'Querying Essentials (SELECT, GROUP BY, HAVING)',
        desc: 'Master writing queries: filter rows with WHERE, group data with GROUP BY, and apply group filters with HAVING.',
        concepts: [
          { title: 'Logical Query Order', text: 'SQL parses clauses in this order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.' },
          { title: 'GROUP BY', text: 'Groups rows sharing key values to run aggregate functions (SUM, COUNT, AVG).' },
          { title: 'HAVING vs WHERE', text: 'WHERE filters rows before grouping. HAVING filters groups after aggregation.' }
        ],
        code: 'SELECT DeptId, COUNT(*) AS EmpCount\nFROM Employees\nWHERE IsActive = 1\nGROUP BY DeptId\nHAVING COUNT(*) > 5; // Group filter',
        pitfalls: 'Attempting to filter aggregated columns in the WHERE clause, which causes compile errors because WHERE runs before grouping.',
        questions: [
          { id: 'sql-query-q1', question: 'What is the difference between WHERE and HAVING?', answer: 'WHERE filters individual source rows before grouping. HAVING filters grouped/aggregated values after grouping.' },
          { id: 'sql-query-q2', question: 'In what order does SQL Server process query clauses?', answer: 'FROM, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY.' }
        ]
      },
      {
        id: 'sql-joins-deep',
        title: 'SQL Joins (Inner, Left, Right, Full, Cross, Self)',
        desc: 'Combine data across related tables using standard join types.',
        concepts: [
          { title: 'Inner Join', text: 'Returns only the rows that have matching values in both tables.' },
          { title: 'Left / Right Join', text: 'Left Join returns all rows from the left table and matching rows from the right table, filling with nulls if there is no match.' },
          { title: 'Cross Join', text: 'Returns the Cartesian product of the two tables (every combination).' }
        ],
        code: 'SELECT e.Name, d.Name AS DeptName\nFROM Employees e\nLEFT JOIN Departments d ON e.DeptId = d.Id;',
        pitfalls: 'Forgetting the join condition (the ON clause) in traditional joins, which generates huge Cartesian products and exhausts database memory.',
        questions: [
          { id: 'sql-join-q1', question: 'What happens during a Left Join if no match is found in the right table?', answer: 'The query returns all columns for the right table as NULL values.' },
          { id: 'sql-join-q2', question: 'What is a Self Join?', answer: 'A join where a table is joined with itself (e.g. matching employees to their managers in the same table).' }
        ]
      },
      {
        id: 'sql-set-operators',
        title: 'Set Operations (UNION, INTERSECT, EXCEPT)',
        desc: 'Combine query outputs using set algebra: UNION, UNION ALL, INTERSECT, and EXCEPT.',
        concepts: [
          { title: 'UNION', text: 'Combines outputs and filters out duplicate rows.' },
          { title: 'UNION ALL', text: 'Appends query results directly, retaining duplicates. Faster than UNION.' },
          { title: 'INTERSECT / EXCEPT', text: 'INTERSECT returns common rows. EXCEPT returns rows from query 1 not present in query 2.' }
        ],
        code: 'SELECT City FROM Customers\nUNION ALL\nSELECT City FROM Suppliers; // Retains duplicates',
        pitfalls: 'Using UNION instead of UNION ALL when you do not care about duplicate rows. UNION is slower because it performs a sort to remove duplicates.',
        questions: [
          { id: 'sql-set-q1', question: 'Why is UNION ALL faster than UNION?', answer: 'Because UNION ALL appends the result sets immediately, while UNION must sort the combined set to filter out duplicates.' },
          { id: 'sql-set-q2', question: 'What are the rules for combining queries with set operators?', answer: 'Queries must have the same number of columns in the same order, with compatible data types.' }
        ]
      },
      {
        id: 'sql-functions',
        title: 'Built-in Scalar & Aggregate Functions',
        desc: 'Manipulate strings, calculate dates, and compute metrics using functions.',
        concepts: [
          { title: 'Scalar Functions', text: 'Operate on a single value and return a single value (SUBSTRING, GETDATE).' },
          { title: 'Aggregate Functions', text: 'Operate on a column of values and return a single summary (SUM, COUNT, AVG).' },
          { title: 'Coalesce', text: 'Returns the first non-null argument in a parameter list.' }
        ],
        code: 'SELECT Name, COALESCE(Phone, Email, \'No Contact\') AS ContactInfo\nFROM Customers;',
        pitfalls: 'Applying scalar functions to indexed columns in WHERE clauses, which prevents the query optimizer from performing Index Seeks.',
        questions: [
          { id: 'sql-func-q1', question: 'What is the COALESCE function used for?', answer: 'It evaluates arguments sequentially and returns the first non-NULL value in the list.' },
          { id: 'sql-func-q2', question: 'Name three common SQL Server aggregate functions.', answer: 'COUNT(), SUM(), and AVG().' }
        ]
      },
      {
        id: 'sql-subqueries-ctes',
        title: 'Subqueries & CTEs (Common Table Expressions)',
        desc: 'Simplify complex queries using nested subqueries, Correlated Subqueries, and Common Table Expressions (CTEs).',
        concepts: [
          { title: 'Subquery', text: 'A query nested inside another query (e.g. in the WHERE clause).' },
          { title: 'CTE (WITH)', text: 'A temporary named result set defined within the execution scope of a single query.' },
          { title: 'Correlated Subquery', text: 'A nested query that references columns from the outer query, running once per row.' }
        ],
        code: 'WITH Sales_CTE AS (\n    SELECT SalesPersonId, SUM(Amount) AS TotalSales\n    FROM Sales\n    GROUP BY SalesPersonId\n)\nSELECT * FROM Sales_CTE WHERE TotalSales > 50000;',
        pitfalls: 'Using deeply nested subqueries instead of CTEs, which makes SQL code hard to read and maintain.',
        questions: [
          { id: 'sql-cte-q1', question: 'What is a Common Table Expression (CTE)?', answer: 'A temporary named result set that can be referenced within a SELECT, INSERT, UPDATE, or DELETE statement.' },
          { id: 'sql-cte-q2', question: 'What is a correlated subquery?', answer: 'A subquery that depends on columns from the outer query and is executed once for each row processed by the outer query.' }
        ]
      },
      {
        id: 'sql-procedures-functions',
        title: 'Stored Procedures & User Defined Functions',
        desc: 'Encapsulate SQL logic into reusable databases assets: Stored Procedures and User Defined Functions (UDFs).',
        concepts: [
          { title: 'Stored Procedure', text: 'Precompiled SQL code block. Can return multiple datasets, modify data, and take parameters.' },
          { title: 'User Defined Function (UDF)', text: 'Calculates and returns a single scalar value or a table. Cannot modify data.' },
          { title: 'Execution Plan Caching', text: 'Procedures compile once and cache plans for faster subsequent executions.' }
        ],
        code: 'CREATE PROCEDURE GetEmployeeById @EmpId INT\nAS\nBEGIN\n    SELECT * FROM Employees WHERE Id = @EmpId;\nEND;',
        pitfalls: 'Using scalar User Defined Functions inside SELECT lists on large tables, which causes SQL Server to execute the function row-by-row (RBAR - Row By Agonizing Row) and ruins performance.',
        questions: [
          { id: 'sql-proc-q1', question: 'What is the main difference between a Stored Procedure and a Function?', answer: 'Procedures can modify database tables and execute transactions. Functions cannot modify state and must return a value.' },
          { id: 'sql-proc-q2', question: 'What is parameter sniffing?', answer: 'A compilation behavior where SQL Server compiles a procedure plan using the parameters passed on the first run, which can be inefficient for other parameter values.' }
        ]
      },
      {
        id: 'sql-views-triggers',
        title: 'Views & Triggers',
        desc: 'Create virtual tables using Views, and intercept database actions (Insert, Update, Delete) using Triggers.',
        concepts: [
          { title: 'View', text: 'A virtual table based on a SELECT query. Simplifies security and complex queries.' },
          { title: 'DML Triggers', text: 'Code executed automatically when data in a table is modified.' },
          { title: 'Inserted & Deleted Tables', text: 'Temporary tables accessible inside triggers containing row state modifications.' }
        ],
        code: 'CREATE VIEW ActiveEmployees AS\nSELECT Id, Name FROM Employees WHERE IsActive = 1;',
        pitfalls: 'Overusing Triggers to manage business logic, which makes debugging extremely difficult because code runs invisibly.',
        questions: [
          { id: 'sql-view-q1', question: 'What are the Inserted and Deleted tables in triggers?', answer: 'Temporary, memory-resident tables containing the state of rows before and after the modification.' },
          { id: 'sql-view-q2', question: 'Does a view store data physically?', answer: 'No, standard views are virtual tables. Indexed views (materialized views), however, do store data physically on disk.' }
        ]
      },
      {
        id: 'sql-acid-transactions',
        title: 'ACID Properties & Transactions',
        desc: 'Ensure database integrity using transactions that satisfy ACID properties: Atomicity, Consistency, Isolation, and Durability.',
        concepts: [
          { title: 'Atomicity', text: 'Ensures all database actions in a transaction succeed, or all roll back (All-or-Nothing).' },
          { title: 'Consistency', text: 'Guarantees the database transitions from one valid state to another.' },
          { title: 'Isolation / Durability', text: 'Isolation keeps concurrent transactions separate. Durability ensures committed changes survive crashes.' }
        ],
        code: 'BEGIN TRANSACTION;\nBEGIN TRY\n    UPDATE Accounts SET Balance -= 100 WHERE Id = 1;\n    UPDATE Accounts SET Balance += 100 WHERE Id = 2;\n    COMMIT TRANSACTION;\nEND TRY\nBEGIN CATCH\n    ROLLBACK TRANSACTION;\nEND CATCH;',
        pitfalls: 'Leaving transactions open by forgetting COMMIT or ROLLBACK, which blocks locks and causes database freezes.',
        questions: [
          { id: 'sql-acid-q1', question: 'What does ACID stand for?', answer: 'Atomicity, Consistency, Isolation, and Durability, the core principles of reliable database transactions.' },
          { id: 'sql-acid-q2', question: 'What happens if a SQL query fails inside a BEGIN TRANSACTION block without error handling?', answer: 'The transaction remains open and lock resources stay blocked until the connection is closed or rolled back.' }
        ]
      },
      {
        id: 'sql-isolation-levels',
        title: 'Transaction Isolation Levels',
        desc: 'Control database locks behavior and prevent anomalies like Dirty Reads, Non-Repeatable Reads, and Phantom Reads.',
        concepts: [
          { title: 'Read Uncommitted', text: 'Allows reading uncommitted data, causing Dirty Reads. Low lock overhead.' },
          { title: 'Read Committed', text: 'Default level. Prevents dirty reads by holding shared locks until reads finish.' },
          { title: 'Serializable', text: 'Highest isolation. Places range locks to prevent phantom reads.' }
        ],
        code: 'SET TRANSACTION ISOLATION LEVEL SNAPSHOT;\nBEGIN TRANSACTION;\nSELECT * FROM Products;\nCOMMIT TRANSACTION;',
        pitfalls: 'Setting isolation level to Serializable unnecessarily, which blocks concurrent queries and slows down execution.',
        questions: [
          { id: 'sql-iso-q1', question: 'What is a dirty read?', answer: 'Reading data that has been modified by an active transaction but has not yet been committed.' },
          { id: 'sql-iso-q2', question: 'How does Snapshot isolation prevent locking readers?', answer: 'It uses row versioning in tempdb to show readers the data state at the start of the transaction, avoiding shared locks.' }
        ]
      },
      {
        id: 'sql-indexing-tuning-deep',
        title: 'Indexing Strategies & Query Optimization',
        desc: 'Optimize database tables using Clustered and Non-Clustered indexes, and analyze execution plans.',
        concepts: [
          { title: 'Clustered Index', text: 'Re-orders table data physically on disk. Only 1 per table.' },
          { title: 'Non-Clustered Index', text: 'A separate search index pointing to row IDs. Multiple allowed.' },
          { title: 'Covering Index', text: 'Adding INCLUDE columns to indexes so queries resolve entirely within the index.' }
        ],
        code: 'CREATE CLUSTERED INDEX IX_Employees_Id ON Employees(Id);\nCREATE NONCLUSTERED INDEX IX_Employees_Email ON Employees(Email) INCLUDE(Name);',
        pitfalls: 'Adding indexes to every column, which slows down INSERT, UPDATE, and DELETE queries because all indexes must be rebuilt.',
        questions: [
          { id: 'sql-idx-q1', question: 'What is a covering index?', answer: 'An index that contains all the columns referenced by a query, allowing results to resolve without table lookups.' },
          { id: 'sql-idx-q2', question: 'What is the difference between an Index Scan and an Index Seek?', answer: 'A scan searches the entire index tree (slow). A seek navigates directly to matching rows using search keys (fast).' }
        ]
      },
      {
        id: 'sql-normalization',
        title: 'Database Normalization',
        desc: 'Minimize data redundancy and prevent anomalies by normalizing tables into 1NF, 2NF, 3NF, and BCNF.',
        concepts: [
          { title: '1NF (First Normal Form)', text: 'Atomic columns and unique rows. No repeating groups.' },
          { title: '2NF (Second Normal Form)', text: 'Meets 1NF. Removes partial dependencies (all columns depend on the entire primary key).' },
          { title: '3NF (Third Normal Form)', text: 'Meets 2NF. Removes transitive dependencies (non-key columns depend only on the primary key).' }
        ],
        code: '// 3NF Rule: ZipCode table should hold City/State columns,\n// and Customers table should only store ZipCodeId.',
        pitfalls: 'Over-normalizing simple databases, which requires joining too many tables for basic queries and slows down performance.',
        questions: [
          { id: 'sql-norm-q1', question: 'What is transitive dependency in 3NF?', answer: 'When a non-key column depends on another non-key column, rather than directly on the primary key.' },
          { id: 'sql-norm-q2', question: 'When is denormalization acceptable?', answer: 'In read-heavy reporting systems (Data Warehouses) to reduce JOIN complexity and speed up reads.' }
        ]
      },
      {
        id: 'sql-security-policies',
        title: 'SQL Server Security Policies',
        desc: 'Secure database instances using logins, users, schemas, and Row-Level Security (RLS).',
        concepts: [
          { title: 'Logins vs Users', text: 'Logins grant server connection access. Users grant access to specific databases.' },
          { title: 'Row-Level Security (RLS)', text: 'Filters query rows automatically based on user roles and security predicates.' },
          { title: 'SQL Injection Prevention', text: 'Always use parameterized queries, never concatenate SQL strings.' }
        ],
        code: 'CREATE SECURITY POLICY SalesFilter\nADD FILTRATION PREDICATE dbo.fn_securitypredicate(SalesPersonId)\nON dbo.Orders;',
        pitfalls: 'Using the "sa" (system administrator) account for application connections, exposing full database access.',
        questions: [
          { id: 'sql-sec-q1', question: 'What is the difference between a Login and a User?', answer: 'A Login is for server authentication. A User is database-specific, mapping a login to table access.' },
          { id: 'sql-sec-q2', question: 'How do parameterized queries prevent SQL injection?', answer: 'By treating inputs strictly as literal values rather than executable SQL commands.' }
        ]
      },
      {
        id: 'sql-disaster-recovery',
        title: 'Disaster Recovery (Backup & Restore)',
        desc: 'Plan database recovery strategies using Full, Differential, and Transaction Log backups.',
        concepts: [
          { title: 'Backup Types', text: 'Full (entire DB), Differential (changes since last Full), Log (changes since last Log backup).' },
          { title: 'Recovery Models', text: 'Simple (no log backups, auto-truncates), Full (retains transaction logs, allows point-in-time recovery).' },
          { title: 'Point-In-Time Restore', text: 'Restoring a database to a specific second before a corruption event.' }
        ],
        code: 'BACKUP DATABASE TutorialDb TO DISK = \'D:\\Backup\\TutorialDb.bak\';\nBACKUP LOG TutorialDb TO DISK = \'D:\\Backup\\TutorialDb_Log.trn\';',
        pitfalls: 'Running database recovery in Full Recovery Model without setting up Transaction Log backups, causing transaction log files (.ldf) to grow until the disk is full.',
        questions: [
          { id: 'sql-rec-q1', question: 'Why does the transaction log grow continuously in Full Recovery Model?', answer: 'Because SQL Server keeps the log until a Transaction Log backup is run to truncate committed logs.' },
          { id: 'sql-rec-q2', question: 'What is a differential backup?', answer: 'A backup that contains all changes made to the database since the last full database backup.' }
        ]
      }
    ]
  },
  'design-patterns': {
    name: 'Design Patterns',
    topics: [
      {
        id: 'dp-intro',
        title: 'Design Patterns Philosophy & Catalog',
        desc: 'Design patterns are typical solutions to common software design challenges, acting as templates to create clean architecture.',
        concepts: [
          { title: 'Software design templates', text: 'Reusable solutions for object creation, structures, and behaviors.' },
          { title: 'Gang of Four (GoF)', text: 'The authors who categorized the 23 classic software design patterns.' },
          { title: 'Categorization', text: 'Creational (creation), Structural (composition), and Behavioral (interaction) patterns.' }
        ],
        code: '// Design patterns provide structural templates\n// for reusable code relationships.',
        pitfalls: 'Applying patterns blindly to simple problems, creating over-engineered, complex code.',
        questions: [
          { id: 'dp-int-q1', question: 'What is a design pattern?', answer: 'A reusable solution template to a common design problem in software engineering.' },
          { id: 'dp-int-q2', question: 'Who are the Gang of Four (GoF)?', answer: 'Gamma, Helm, Johnson, and Vlissides, the authors of the foundational book on patterns.' }
        ]
      },
      {
        id: 'dp-categorization',
        title: 'Creational, Structural & Behavioral categorization',
        desc: 'Differentiate between Creational, Structural, and Behavioral patterns based on their design motivations.',
        concepts: [
          { title: 'Creational Patterns', text: 'Manage class instantiation, isolating how objects are created.' },
          { title: 'Structural Patterns', text: 'Compose classes and objects to build larger structural systems.' },
          { title: 'Behavioral Patterns', text: 'Manage algorithms, communications, and assignments of responsibilities.' }
        ],
        code: '// Creational: Factory, Singleton\n// Structural: Adapter, Decorator\n// Behavioral: Observer, Strategy',
        pitfalls: 'Confusing patterns across categories, like attempting to use a structural adapter to create objects.',
        questions: [
          { id: 'dp-cat-q1', question: 'What is the goal of Creational patterns?', answer: 'To abstract object instantiation, making systems independent of how their objects are created.' },
          { id: 'dp-cat-q2', question: 'What do Structural patterns focus on?', answer: 'How classes and objects can be composed to form larger, flexible structures.' }
        ]
      },
      {
        id: 'dp-singleton',
        title: 'Singleton Pattern',
        desc: 'Ensure a class has only one instance globally and provide a single access point to it.',
        concepts: [
          { title: 'Private Constructor', text: 'Prevents external classes from creating instances using "new".' },
          { title: 'Static Instance Holder', text: 'A private static field that holds the single instance.' },
          { title: 'Thread Safety', text: 'Implementing locks or lazy instantiation to handle multi-threaded access.' }
        ],
        code: 'public sealed class CacheManager {\n    private static readonly Lazy<CacheManager> instance = \n        new Lazy<CacheManager>(() => new CacheManager());\n    private CacheManager() { } // Private constructor\n    public static CacheManager Instance => instance.Value;\n}',
        pitfalls: 'Creating singletons for state-heavy objects that should be transient, which causes data leakage across users.',
        questions: [
          { id: 'dp-sing-q1', question: 'How do you make a Singleton thread-safe in C#?', answer: 'By using Lazy<T> or double-check locking to ensure only one instance is initialized.' },
          { id: 'dp-sing-q2', question: 'Why is Singleton sometimes considered an anti-pattern?', answer: 'Because it introduces global state and makes unit testing difficult due to hard dependencies.' }
        ]
      },
      {
        id: 'dp-factory',
        title: 'Factory Method & Abstract Factory',
        desc: 'Define interfaces for object creation, letting subclasses decide which concrete classes to instantiate.',
        concepts: [
          { title: 'Factory Method', text: 'Abstracts instantiation of a single product family using subclasses.' },
          { title: 'Abstract Factory', text: 'Interface to create families of related products without specifying concrete classes.' },
          { title: 'Loose Coupling', text: 'Keeps callers decoupled from specific constructor implementations.' }
        ],
        code: 'public interface IButton { void Render(); }\npublic abstract class UIControlFactory {\n    public abstract IButton CreateButton();\n}',
        pitfalls: 'Adding too many product variants, which requires editing and complicating the factory classes.',
        questions: [
          { id: 'dp-fact-q1', question: 'What is the difference between Factory Method and Abstract Factory?', answer: 'Factory Method uses inheritance to instantiate a single product. Abstract Factory uses composition to create families of related products.' },
          { id: 'dp-fact-q2', question: 'How does the Factory pattern follow the Open/Closed principle?', answer: 'You can introduce new product implementations without changing the client code that consumes the factory.' }
        ]
      },
      {
        id: 'dp-builder',
        title: 'Builder Pattern',
        desc: 'Construct complex objects step-by-step using fluent method interfaces.',
        concepts: [
          { title: 'Step-by-step Construction', text: 'Adding configurations to an object incrementally.' },
          { title: 'Fluent Interface', text: 'Methods return "this" to allow method chaining.' },
          { title: 'Build Method', text: 'A final method that returns the fully configured object.' }
        ],
        code: 'var doc = new DocumentBuilder()\n    .AddTitle("Report")\n    .AddAuthor("Ashutosh")\n    .Build();',
        pitfalls: 'Using the Builder pattern for simple objects that could be initialized easily using standard properties.',
        questions: [
          { id: 'dp-build-q1', question: 'When is the Builder pattern useful?', answer: 'When an object requires complex, multi-step configuration or has constructor parameter configurations.' },
          { id: 'dp-build-q2', question: 'What is a fluent API in the Builder pattern?', answer: 'A syntax design where builder methods return the builder instance (this), allowing method chaining.' }
        ]
      },
      {
        id: 'dp-prototype',
        title: 'Prototype Pattern',
        desc: 'Clone existing objects to create new instances, avoiding expensive creation steps.',
        concepts: [
          { title: 'Cloning', text: 'Copying an existing object instance.' },
          { title: 'Shallow vs Deep Copy', text: 'Shallow copies copy references. Deep copies recursively copy referenced objects.' },
          { title: 'ICloneable', text: 'Standard .NET interface used to implement object cloning.' }
        ],
        code: 'public class User : ICloneable {\n    public string Name { get; set; }\n    public object Clone() => this.MemberwiseClone(); // Shallow copy\n}',
        pitfalls: 'Relying on MemberwiseClone() (shallow copy) when your object has reference fields, which shares objects between clones.',
        questions: [
          { id: 'dp-proto-q1', question: 'What is the difference between a shallow copy and a deep copy?', answer: 'A shallow copy copies value properties and references. A deep copy creates new instances of all nested reference properties.' },
          { id: 'dp-proto-q2', question: 'When should you use the Prototype pattern?', answer: 'When creating a new object is computationally expensive or requires external resources (like database lookups).' }
        ]
      },
      {
        id: 'dp-adapter',
        title: 'Adapter Pattern',
        desc: 'Convert the interface of a class into another interface that clients expect, enabling incompatible systems to work together.',
        concepts: [
          { title: 'Wrapper', text: 'Converts requests from a target interface to a client interface.' },
          { title: 'Target / Adaptee', text: 'Target is the interface expected by clients. Adaptee is the incompatible class being adapted.' },
          { title: 'Loose Coupling', text: 'Enables legacy code integration without changing source structures.' }
        ],
        code: 'public class LegacyPrinter { public void PrintLegacy(string s) { } }\npublic interface IPrinter { void Print(string s); }\npublic class PrinterAdapter : IPrinter {\n    private LegacyPrinter legacy = new LegacyPrinter();\n    public void Print(string s) => legacy.PrintLegacy(s);\n}',
        pitfalls: 'Adding business logic inside the adapter class. The adapter should only handle interface mapping and delegate calls.',
        questions: [
          { id: 'dp-adapt-q1', question: 'What is the primary purpose of the Adapter pattern?', answer: 'To allow classes with incompatible interfaces to work together by wrapping one class interface.' },
          { id: 'dp-adapt-q2', question: 'Can an adapter support two-way conversion?', answer: 'Yes, if it implements both target interfaces and delegates calls in both directions.' }
        ]
      },
      {
        id: 'dp-decorator',
        title: 'Decorator Pattern',
        desc: 'Attach additional responsibilities to an object dynamically, providing a flexible alternative to subclassing.',
        concepts: [
          { title: 'Wrapper pattern', text: 'Wrapping an object and providing matching method signatures.' },
          { title: 'Open/Closed principle', text: 'Adding features to objects without changing original classes.' },
          { title: 'Stacking decorators', text: 'Chaining multiple wrappers together (e.g. CompressionDecorator(EncryptionDecorator(FileStream))).' }
        ],
        code: 'public interface IMessage { string Send(); }\npublic class MessageDecorator : IMessage {\n    private IMessage message;\n    public MessageDecorator(IMessage m) => message = m;\n    public virtual string Send() => message.Send();\n}',
        pitfalls: 'Creating deep decorator chains that make debugging difficult when errors happen inside inner wrappers.',
        questions: [
          { id: 'dp-dec-q1', question: 'How does Decorator differ from Inheritance?', answer: 'Inheritance adds behavior at compile-time to all instances. Decorator attaches behavior dynamically at runtime to specific object instances.' },
          { id: 'dp-dec-q2', question: 'Give a real-world framework example of the Decorator pattern.', answer: 'The System.IO.Stream pipeline, where you wrap streams with BufferedStream or CryptoStream.' }
        ]
      },
      {
        id: 'dp-facade',
        title: 'Facade Pattern',
        desc: 'Provide a unified, simplified interface to a complex subsystem of classes.',
        concepts: [
          { title: 'Unified Interface', text: 'Exposing a single entry point method.' },
          { title: 'Subsystem Decoupling', text: 'Clients interact with the facade instead of managing multiple subsystem classes.' },
          { title: 'Simplify client calls', text: 'Hiding complex instantiation and method steps.' }
        ],
        code: 'public class MortgageFacade {\n    private Bank bank = new Bank();\n    private Credit credit = new Credit();\n    public bool IsEligible(Customer c) => bank.HasSavings(c) && credit.HasClearHistory(c);\n}',
        pitfalls: 'Making the Facade class too powerful, turning it into a "God Class" that contains subsystem business logic instead of just routing calls.',
        questions: [
          { id: 'dp-fac-q1', question: 'What is the main goal of the Facade pattern?', answer: 'To provide a simplified, single interface to a complex subsystem, making it easier to use.' },
          { id: 'dp-fac-q2', question: 'Does a Facade prevent clients from accessing subsystems directly?', answer: 'No, clients can still access and use subsystem classes directly if they need advanced configurations.' }
        ]
      },
      {
        id: 'dp-proxy',
        title: 'Proxy Pattern',
        desc: 'Provide a surrogate or placeholder for another object to control access, perform lazy loading, or cache requests.',
        concepts: [
          { title: 'Lazy Initialization (Virtual Proxy)', text: 'Delaying initialization of expensive objects until they are needed.' },
          { title: 'Access Control (Protection Proxy)', text: 'Verifying client permissions before delegating calls.' },
          { title: 'Caching (Cache Proxy)', text: 'Storing query results to return matches without running expensive operations again.' }
        ],
        code: 'public class SecureDocumentProxy : IDocument {\n    private RealDocument doc;\n    public void Display(User u) {\n        if (u.Role == "Admin") {\n            doc ??= new RealDocument(); doc.Display(u);\n        }\n    }\n}',
        pitfalls: 'Adding too many layers of proxy wrappers, which adds method call latency and complicates design.',
        questions: [
          { id: 'dp-prox-q1', question: 'What is a Virtual Proxy?', answer: 'A proxy that controls access to a resource that is expensive to create, instantiating it only when requested.' },
          { id: 'dp-prox-q2', question: 'How does Proxy differ from Decorator?', answer: 'Proxy manages the lifecycle of its subject object. Decorator is passed its subject instance by the client.' }
        ]
      },
      {
        id: 'dp-composite-flyweight',
        title: 'Composite & Flyweight Patterns',
        desc: 'Treat single objects and collections uniformly using Composite, and share objects to save memory using Flyweight.',
        concepts: [
          { title: 'Composite Pattern', text: 'Groups objects into tree structures to represent part-whole hierarchies.' },
          { title: 'Flyweight Pattern', text: 'Shares fine-grained objects to support large quantities of objects efficiently.' },
          { title: 'Intrinsic vs Extrinsic State', text: 'Intrinsic state is shared (Flyweight). Extrinsic state depends on context.' }
        ],
        code: '// Composite tree node\npublic interface IComponent { void Display(); }\npublic class Folder : IComponent {\n    private List<IComponent> children = new List<IComponent>();\n    public void Display() => children.ForEach(c => c.Display());\n}',
        pitfalls: 'Making composite interfaces too generic, which forces leaf nodes to implement methods (like Add/Remove) they do not support.',
        questions: [
          { id: 'dp-comp-q1', question: 'What is the goal of the Flyweight pattern?', answer: 'To reduce memory usage by sharing common data across multiple objects instead of duplicating it.' },
          { id: 'dp-comp-q2', question: 'When should the Composite pattern be used?', answer: 'When you need to treat single objects and composite groups of objects uniformly (like files and folders).' }
        ]
      },
      {
        id: 'dp-strategy',
        title: 'Strategy Pattern',
        desc: 'Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.',
        concepts: [
          { title: 'Interchangeable algorithms', text: 'Selecting algorithms dynamically based on context.' },
          { title: 'Open/Closed principle', text: 'Adding new strategies without modifying existing context classes.' },
          { title: 'Abstractions', text: 'Strategies implement a shared interface contract.' }
        ],
        code: 'public interface ISortStrategy { void Sort(List<int> list); }\npublic class QuickSort : ISortStrategy { public void Sort(List<int> l) { } }\npublic class Context {\n    private ISortStrategy strat;\n    public void SetStrategy(ISortStrategy s) => strat = s;\n    public void Execute(List<int> l) => strat.Sort(l);\n}',
        pitfalls: 'Implementing Strategy when the algorithm never changes, adding unnecessary classes and interface overhead.',
        questions: [
          { id: 'dp-strat-q1', question: 'How does the Strategy pattern implement the Open/Closed Principle?', answer: 'By letting you introduce new algorithms (strategies) as separate classes without modifying the class that uses them.' },
          { id: 'dp-strat-q2', question: 'What is the difference between Strategy and State patterns?', answer: 'In Strategy, the client selects the strategy. In State, the state transitions occur dynamically inside the context object based on its internal state.' }
        ]
      },
      {
        id: 'dp-observer',
        title: 'Observer Pattern',
        desc: 'Create one-to-many subscription models where subject changes notify subscribing observer objects automatically.',
        concepts: [
          { title: 'Subject / Observable', text: 'Manages a list of observers and notifies them when state changes.' },
          { title: 'Observer', text: 'Subscribes to updates and implements an Update method.' },
          { title: 'Publish-Subscribe', text: 'Decoupled communication pattern where senders don\'t know specific receivers.' }
        ],
        code: 'public interface IObserver { void Update(string state); }\npublic class Subject {\n    private List<IObserver> observers = new List<IObserver>();\n    public void Notify(string state) => observers.ForEach(o => o.Update(state));\n}',
        pitfalls: 'Forgetting to unsubscribe observers, which causes memory leaks because subjects retain references to deleted objects.',
        questions: [
          { id: 'dp-obs-q1', question: 'How does the Observer pattern decouple objects?', answer: 'The Subject only knows that observers implement a specific interface; it doesn\'t know the concrete classes or their internal workings.' },
          { id: 'dp-obs-q2', question: 'What is a memory leak hazard in the Observer pattern?', answer: 'If observers do not unsubscribe when disposed, the Subject holds their references in memory, preventing garbage collection.' }
        ]
      },
      {
        id: 'dp-command',
        title: 'Command Pattern',
        desc: 'Encapsulate requests as objects, allowing parameterization, queueing, and rollback logs.',
        concepts: [
          { title: 'Request Encapsulation', text: 'Wrapping an action and its parameters inside a class.' },
          { title: 'Undo / Redo', text: 'Implementing execution history and rollback methods (Unexecute()).' },
          { title: 'Invoker', text: 'The class that triggers the command execution.' }
        ],
        code: 'public interface ICommand { void Execute(); void Undo(); }\npublic class OpenCommand : ICommand {\n    private Receiver receiver;\n    public void Execute() => receiver.Open();\n    public void Undo() => receiver.Close();\n}',
        pitfalls: 'Creating a new command class for every single minor method call, resulting in class bloat in the project.',
        questions: [
          { id: 'dp-cmd-q1', question: 'How does the Command pattern support undo operations?', answer: 'By storing the state required to reverse the action within the command object, and executing an Undo() method.' },
          { id: 'dp-cmd-q2', question: 'What are the main components of the Command pattern?', answer: 'The Client, Invoker, Command Interface, Concrete Command, and Receiver.' }
        ]
      },
      {
        id: 'dp-state',
        title: 'State Pattern',
        desc: 'Allow objects to alter their behavior dynamically when their internal state changes.',
        concepts: [
          { title: 'State Abstraction', text: 'Encapsulating state-specific behavior into separate state classes.' },
          { title: 'Context delegation', text: 'The context object delegates actions to the current state object.' },
          { title: 'Transitions', text: 'Changing the current state instance dynamically during execution.' }
        ],
        code: 'public interface IOrderState { void Process(OrderContext ctx); }\npublic class PlacedState : IOrderState {\n    public void Process(OrderContext ctx) => ctx.State = new ShippedState();\n}',
        pitfalls: 'Writing state transition logic in a way that creates tight coupling between concrete state classes.',
        questions: [
          { id: 'dp-state-q1', question: 'When is the State pattern useful?', answer: 'When an object\'s behavior depends on its state, and its code contains massive conditional statements branching based on state values.' },
          { id: 'dp-state-q2', question: 'Where should state transition logic be defined?', answer: 'It can be defined either inside the context object, or inside the individual state classes, depending on the complexity.' }
        ]
      },
      {
        id: 'dp-chain-responsibility',
        title: 'Chain of Responsibility',
        desc: 'Pass requests along a chain of handlers, letting each handler process or pass the request to the next.',
        concepts: [
          { title: 'Handler Chain', text: 'A sequence of handler objects linked by references.' },
          { title: 'Request processing', text: 'Each handler decides to process the request or pass it to the next.' },
          { title: 'Decoupling Senders', text: 'The sender doesn\'t know which specific handler will process the request.' }
        ],
        code: 'public abstract class Handler {\n    protected Handler next;\n    public void SetNext(Handler h) => next = h;\n    public abstract void HandleRequest(Request r);\n}',
        pitfalls: 'Not handling the end of the chain, which can cause requests to fall off the chain and remain unprocessed.',
        questions: [
          { id: 'dp-chain-q1', question: 'Give a framework example of the Chain of Responsibility pattern.', answer: 'The HTTP middleware pipeline in ASP.NET Core, where each middleware handles or passes requests down the line.' },
          { id: 'dp-chain-q2', question: 'What is the risk of an unhandled request in this pattern?', answer: 'The request may reach the end of the chain without being processed, resulting in silent failures.' }
        ]
      },
      {
        id: 'dp-template-method',
        title: 'Template Method Pattern',
        desc: 'Define the skeleton of an algorithm in a base method, deferring some steps to subclasses without changing the algorithm\'s structure.',
        concepts: [
          { title: 'Algorithm Skeleton', text: 'The main method defines the execution steps.' },
          { title: 'Hook Methods', text: 'Abstract or virtual steps overridden in subclasses to customize behavior.' },
          { title: 'Inversion of Control', text: 'The parent class calls the subclass methods, not vice versa (Hollywood Principle).' }
        ],
        code: 'public abstract class DataParser {\n    public void ParseData() {\n        OpenConnection(); ReadData(); CloseConnection(); // Skeleton\n    }\n    protected abstract void ReadData();\n}',
        pitfalls: 'Violating the Liskov Substitution Principle by overriding template steps in a way that breaks base class assumptions.',
        questions: [
          { id: 'dp-temp-q1', question: 'What is the "Hollywood Principle" in Template Method?', answer: '"Don\'t call us, we\'ll call you"—the base class calls the subclass override methods at the correct execution step.' },
          { id: 'dp-temp-q2', question: 'How does Template Method differ from Strategy?', answer: 'Template Method uses inheritance to vary parts of an algorithm. Strategy uses composition to swap the entire algorithm.' }
        ]
      },
      {
        id: 'dp-iterator-mediator',
        title: 'Iterator & Mediator Patterns',
        desc: 'Traverse collections sequentially using Iterator, and encapsulate complex object communications using Mediator.',
        concepts: [
          { title: 'Iterator Pattern', text: 'Accesses elements of a collection sequentially without exposing its internal structure.' },
          { title: 'Mediator Pattern', text: 'Reduces direct connections between classes by forcing them to communicate through a mediator.' },
          { title: 'MediatR library', text: 'A popular .NET package used to implement in-memory request/response dispatching.' }
        ],
        code: '// Mediator interface snippet\npublic interface IMediator {\n    void Send(string msg, Colleague colleague);\n}',
        pitfalls: 'Creating a "God Mediator" that contains excessive coordination logic, making the mediator class difficult to maintain.',
        questions: [
          { id: 'dp-iter-q1', question: 'What problem does the Mediator pattern solve?', answer: 'It reduces direct references between tightly coupled classes (spaghetti code) by routing communication through a central mediator.' },
          { id: 'dp-iter-q2', question: 'How does the Iterator pattern help collections?', answer: 'It provides a standard interface to traverse different collection types (lists, trees) without exposing their internal storage systems.' }
        ]
      }
    ]
  }
};

// Process curriculum and generate topics for db.json
Object.keys(curriculum).forEach((courseId) => {
  const courseConfig = curriculum[courseId];
  const course = db.courses.find((c) => c.id === courseId);
  if (course) {
    const formattedTopics = courseConfig.topics.map((t) => {
      const htmlContent = generateHtml(courseConfig.name, t.title, t.desc, t.concepts, t.code, t.pitfalls);
      return {
        id: t.id,
        title: t.title,
        viewType: 'detailed',
        content: '',
        example: '',
        html: htmlContent,
        definition: '',
        why: '',
        problem: '',
        realWorldExample: '',
        syntax: '',
        practicalExample: '',
        commonMistakes: '',
        questions: t.questions
      };
    });

    course.topics = formattedTopics;
    console.log(`Successfully generated ${formattedTopics.length} detailed HTML topics for course: "${course.title}" (${courseId}).`);
  } else {
    console.warn(`Course "${courseId}" not found in db.json!`);
  }
});

// Save changes back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Finished writing database file updates.');
