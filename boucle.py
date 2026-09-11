import numpy as np
import matplotlib.pyplot as plt
# La fonction (notre "paysage" montagneux)
def f(x):
    return x**2 + 5 * np.sin(x)
# La dérivée de la fonction (notre "boussole magique" ou gradient)
# La dérivée de x^2 est 2x. La dérivée de 5sin(x) est 5cos(x).
def df(x):
    return 2*x + 5 * np.cos(x)
# Paramètres de la descente de gradient
learning_rate = 0.1  # La taille de nos pas
iterations = 30      # Le nombre de pas que nous allons faire
x_start = 8.0        # Notre point de départ sur la montagne
# Pour garder une trace de notre parcours
path = []
# La boucle d'apprentissage (la randonnée)
x_current = x_start
for i in range(iterations):
    path.append(x_current)
    gradient = df(x_current) # On consulte la boussole
    x_current = x_current - learning_rate * gradient # On fait un pas dans la direction opposée
print(f"Point de départ : x = {x_start:.2f}")
print(f"Minimum trouvé après {iterations} itérations : x = {x_current:.2f}")
print(f"Valeur minimale de la fonction : f(x) = {f(x_current):.2f}")
# Visualisation de la convergence
x_vals = np.linspace(-10, 10, 400)
y_vals = f(x_vals)
path_y = f(np.array(path))
plt.figure(figsize=(12, 7))
plt.plot(x_vals, y_vals, label='f(x) = x² + 5sin(x)')
plt.plot(path, path_y, 'o-', color='red', label='Parcours de la descente de gradient')
plt.title("Visualisation de la Descente de Gradient")
plt.xlabel("x (paramètre du modèle)")
plt.ylabel("f(x) (erreur du modèle)")
plt.legend()
plt.grid(True)
plt.show()
