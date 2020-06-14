# Travelling-Salesman-Problem

El problema del viajante se trata de un problema de optimización formulado durante los 1930s.

__Descripción:__ Imaginemos que hay N ciudades **_(Nodos)_** donde cada ciudad está conectados con otras ciudades **_(Aristas)_**, cada conexión entre las ciudades tenedrán sus costes de viaje **_(Aristas con pesos)_**. Con este información se forma un grafo completo de N nodos. El viajante lo que tiene que hacer es tomar cualquier ciudad como nodo de salida, recorrer por el resto de ciudades una vez y volver a la ciudad de inicio **_(recorrido Hamiltoniano)_**, teniendo como resultado un recorrido. El objetivo del problema es obtener el recorrido cuyo coste de viaje total sea el menor.

__Entrada:__ El problema toma como entrada el número de ciudades para que viaje el viajante, además proporcionando las distancias que existen entre cada una de las ciudades. Para este proyecto se ha cogido los datos del [enlace](http://www.math.uwaterloo.ca/tsp/data/).

__Salida:__ Tras calcular los datos de entrada mediante los algoritmos usados del proyecto, se dibujarán los resultados sobre el plano.

![alt tag](https://github.com/ZReKoJ/Travelling-Salesman-Problem/blob/master/data/images/example_result.png)

## Procesamiento de datos

### Formato de datos de entrada 

Los datos que se han cogido del [enlace](http://www.math.uwaterloo.ca/tsp/data/) viene con el siguiente formato (por línea):

> __NAME:__ Nombre del fichero de datos

> __COMMENT:__ Comentarios sobre el fichero de datos

> __COMMENT:__ Comentarios sobre el fichero de datos

> __TYPE:__ Tipo del fichero de datos

> __DIMENSION:__ Número de ciudades que se proporciona

> __EDGE_WEIGHT_TYPE:__ La recomendación para calcular las distancias

> __NODE_COORD_SECTION:__ La información de nodos, representado por _index_, _latitude_, _longitude_

> __EOF:__ Indica fin del fichero de datos

### Forma de recolectar datos de entrada del proyecto

En este proyecto solo necesita la sección de las coordenadas de los nodos por lo que mediante unos funciones sólo recolectará una lista de de una tupla de dos dimensiones donde el primero indica _latitud_ y _longitud_. Cuyo índice _i_ de la lista indicará que es el nodo _i_. 

```javascript
[
    [1, 4], // Ciudad 0
    [3, 6], // Ciudad 1
    [7, 3], // Ciudad 2
    [2, 6], // Ciudad 3
    [7, 5]  // ...
]
```

### Creación del grafo compuesto

Se guarda la lista de nodos como se indica en la sección anterior. Se creará un grafo utilizando los índices de las listas indicando nodos. Dado el supuesto que la distancia entre la ciudades _A_ - _B_ es la misma que la distancias entre las ciudades _B_ y _A_. Se creará el grafo como un array de arrays (doble dimensión) donde el primer índice indicará la ciudad que tiene como índice mayor y el segundo índice el de la ciudad con índice menor. Ahorrándose así memoria de guardado de datos. Se supone que no hay distancias 0s entre las ciudades pues serían la misma ciudad.

```javascript
[
    [],                 // Ciudad 0 no tiene información de las distancias que tiene con las otras ciudades
    [2],                // Ciudad 1 tiene distancia 2 con la ciudad 0
    [5, 7],             // Ciudad 2 tiene distancia 5 con la ciudad 0 y distancia 7 con la ciudad 1
    [5, 8, 3],          // Ciudad 3 tiene distancia 5 con la ciudad 0 y distancia 8 con la ciudad 1 y distancia 3 con la ciudad 2
    [7, 9, 1, 2],       // ...
]
```

### Formato de la salida

El formato de la salida consistirá en un objeto donde se guarda dos elementos:
- El coste total para llevar a cabo este recorrido.
- Una lista de tuplas de tamaño 2, que a su vez contiene 2 tuplas de tamaño 2. Indicando la lista como lista de aristas, el primer nivel de tuplas indica la ciudad de origen y la ciudad de destino, el segundo nivel de tuplas indica las coordenadas de la ciudad.

```javascript
{
    cost: 20
    path: [         // 2 - 1 - 3 ...
        [
            [7, 3], // Ciudad 2
            [3, 6], // Ciudad 1
        ],          // Coste 7
        [
            [3, 6], // Ciudad 1
            [2, 6], // Ciudad 3
        ],          // Coste 8
        [
            [2, 6], // Ciudad 3
            [1, 4], // Ciudad 0
        ]           // Coste 5
                    // ...
    ]
}
```

## Optimización por emjambres de partículas (PSO)

Se trata de un algoritmo de optimización y búsqueda, inspirada por el comportamiento de los enjambres de insectos, como las abejas, que buscan el polen en lugares donde la densidad de flores sea mayor.

### Coste computacional

Se identifican los parámetros de entradas que influyen en el coste computacional:
1. __X__ como número de iteraciones
2. __N__ como el número de nodos
3. __B__ como el número de populación, en este caso las abejas

Transcripción alto nivel del proceso que se ha usado en el proyecto para el cálculo de la solución:
- Creación de __B__ abejas
    - Por cada abeja creada se crea una solución de __N__ nodos aleatorios por cada abeja creada
    - Por cada abeja creada se calcula el coste de la solución de __N__ nodos anteriormente creado
- __X__ iteraciones
    - Por cada iteración se ordena las __B__ abejas de menor a mayor por coste
    - Por cada abeja __B__
        - Se intercambian valores de la solución actual de la abeja con la solución mejor personal de la abeja teniendo en cuenta las __N__ nodos de la solución
        - Se intercambian valores de la solución actual de la abeja con la solución mejor global de todas las abejas teniendo en cuenta las __N__ nodos de la solución
        - Por cada intercambio de valores anteriormente, que puede llegar a __2 * N__, se hace intercambios de la solución actual de la abeja
- Ordenar las __B__ abejas de menor a mayor por coste para sacar la mejor solución

El coste de la solución sería:
__((B * 2N) + (X * (B + (B * 4N)) + B)__

Simplificando:
__X * B * N__

## Algoritmo de la colonia de hormigas (ACO)

Se trata de un algoritmo de optimización y búsqueda, inspirada por el comportamiento de la colonia de hormigas, que para cargar los alimentos desde el lugar de origen hasta el nido, siempre lo hacen por la distancia mínima, debido a que las hormigas tras encontrar alimento, dejan un rastro (feromonas) para que los siguientes sigan el camino que hizo.

### Coste computacional

Se identifican los parámetros de entradas que influyen en el coste computacional:
1. __X__ como número de iteraciones
2. __N__ como el número de nodos
3. __H__ como el número de populación, en este caso las hormigas

Transcripción alto nivel del proceso que se ha usado en el proyecto para el cálculo de la solución:
- Creación de un recorrido de los __N__ nodos de forma aleatoria para el establecimiento de las feromonas.
- Añadir la información de las feromonas en cada una de las aristas que contiene el grafo __N * N__
- Creación de __H__ hormigas
- __X__ iteraciones
    - Por cada iteración a cada hormiga __H__ se calcula su nuevo camino y el coste
        - A partir del mismo punto de inicio, recorre todos los nodos __N__ aún no visitados
            - Calcula la posibilidad total de los nodos __N__ aún no visitados
            - Selecciona la ciudad __N__ con más posibilidad de ser elegida como siguiente parada
    - Por cada arista del grafo __N * N__
        - Calcula el total de feromonas de las hormigas __H__
- Ordenar las __H__ hormigas de menor a mayor por coste para sacar la mejor solución

El coste de la solución sería:
__((N) + (N * N) + (H) + (X * ((H * N * 2N) + (N * N * H)) + (H))__

Simplificando:
__X * H * N * N__

## Comentarios

Tras revisarse los costes de los dos algoritmos, __PSO__ es de tres dimensiones y __ACO__ es de 4 dimensiones, por lo tanto por velocidad es más rápido el __PSO__, y efectivamente si se ejecuta con los mismos parámetros __ACO__ durá más y tarda más.

Por exactitud de soluciones es mejor el __ACO__ pues al ser más pesada computacionalmente los resultados que proporciona son menos variables que __PSO__, (se puede comprobar con 100 iteraciones y 50 de populación con 50 nodos).

En conclusión, por tiempo o por exactitud se elegirán o uno u otros. Sin embargo ambos son los mismos pues si incremetamos tanto las iteraciones del __PSO__ para que tarde lo mismo que __ACO__, la exactitud del __PSO__ se acercaría también al del __ACO__. Por lo que básicamente son los dos algoritmos. 
