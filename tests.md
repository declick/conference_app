[X] Usecase: Organize a conference
    [X] Create a conference
    [X] The conference must happen in at least 3 days
    [X] The conference must have a maximum of 1000 seats
    [X] The conference must have at least 20 seats
    [X] The conference is too long (> 3 hours)
[X] Usecase: Change the seats of a conference
    [X] Change the number of seats
    [X] The conference must exist
    [X] The user must be the organizer
    [] The seats must be between 20 and 1000
[] Usecase: Change the dates of a conference
    [] Change the dates
    [] The conference must exist
    [] The user must be the organizer
    [] The conference must happen in at least 3 days
    [] The duration must be less than 3 hours
[] Usecase: Cancel a conference
    [] The conference must exist
    [] The user must be the organizer

[] Evaluation
    [X] Finir le test `change-seats.test.ts`: Pas moins de sieges que ceux qui sont deja reserves (50 places - 30 bookings - pas possible de mettre 25 places)
    [X] Faire le usecase `Reserver sa place` et le test unitaires et e2e qui va avec
    [X] Tests d'integration pour `mongo-conference-repository`
    
    Extra Si vous avez du temps::
    [] Mettre en place l'adapter `Jwt-authenticator`
    [] Faire usecase `Annuler Conference` (Attention aux consequences que ca implique sur les reservations)

