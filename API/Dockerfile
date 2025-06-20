FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443  

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app

# Créer les répertoires nécessaires
RUN mkdir -p /app/Uploads && \
    mkdir -p /app/API/Uploads/Profiles

# Copier le certificat HTTPS
COPY localhost.pfx /app/localhost.pfx

# Copier le build publié
COPY --from=build /app/publish .

# Entrée de l'application
ENTRYPOINT ["dotnet", "quest_web.dll"]
