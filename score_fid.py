import numpy as np



clients = np.array([
    [34, 12, 15000],   # Client 1
    [25, 3, 5000],     # Client 2
    [48, 60, 25000],   # Client 3
    [22, 1, 7500],     # Client 4
    [41, 36, 18000]    # Client 5
])


poids = np.array([0.1, 0.4, 0.5])

# 3. Calcul des scores de fidélité


scores_fidelite = np.dot(clients, poids)

# 4. Affichage de la matrice des clients

print("Matrice des clients :")
print(clients)

# 5. Affichage du vecteur des poids

print("\nVecteur des poids :")
print(poids)

# 6. Affichage des scores calculés

print("\nScores de fidélité calculés :")
print(scores_fidelite)

# 7. Affichage du score de chaque client

print("\nDétail des scores :")

for i, score in enumerate(scores_fidelite):
    print(f"Le score du Client {i + 1} est : {score:.2f}")
