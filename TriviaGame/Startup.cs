using DataAccessLayer;
using DatabaseCreateManager.Consts;
using TriviaGame.Hubs;
using TriviaGame.Services;
using TriviaGame.Services.Impl;

namespace TriviaGame
{
    //add     "typeRoots": [ "node_modules/@microsoft/signalr/dist/esm" ] tsconfig
    // npm install http-server -g
    //http-server
    public class Startup
    {
        //public const string clientFolder = "";
        public IConfiguration Configuration { get; set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("CorsPolicy", builder => {
                builder
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins("http://localhost:8081", "http://localhost:8080", "http://fgf-trivia-test.s3-website.us-east-2.amazonaws.com");

            }));

            services.AddMvc();

            services.AddControllers();
            services.AddDataAccessLayer(ConnectionString.connectionString);

            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IQuestionService, QuestionService>();
            services.AddTransient<IPlayerService, PlayerService>();
            services.AddTransient<IGameplayRoomService, GameplayRoomService>();
            

            services.AddSignalR();
            services.AddTransient<TriviaHub>();
        }
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(env.ContentRootPath)
               .AddJsonFile("appsettings.json", true, true);

            Configuration = builder.Build();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors("CorsPolicy");

            app.UseRouting();
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                
                endpoints.MapDefaultControllerRoute();
                endpoints.MapControllers();
                endpoints.MapHub<TriviaHub>("/trivia");
            });
        }
    }
}

//TODO: last task create swagger gen
//private static void AddSwaggerGen(IServiceCollection services)
//{
//    services.AddSwaggerGen(c =>
//    {
//        c.SwaggerDoc("v1", new OpenApiInfo
//        {
//            Title = "Swagger Trivia game  API",
//            Description = "Swagger API for TriviaGame",
//            Version = "v1"
//        });

//        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
//        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
//        c.IncludeXmlComments(xmlPath);

//        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//        {
//            Description = @"Enter 'Bearer' [space] {token}. Example: 'Bearer 12345abcdef'",
//            Name = "Authorization",
//            In = ParameterLocation.Header,
//            Type = SecuritySchemeType.ApiKey,
//            Scheme = "Bearer"
//        });

//        c.AddSecurityRequirement(new OpenApiSecurityRequirement
//        {
//            {
//                new OpenApiSecurityScheme
//                {
//                    Reference = new OpenApiReference
//                    {
//                        Type = ReferenceType.SecurityScheme,
//                        Id = "Bearer",
//                    },
//                    Scheme = "oauth2",
//                    Name = "Bearer",
//                    In = ParameterLocation.Header
//                },
//                new List<string>()
//            }
//        });
//    });
//}
