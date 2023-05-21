# Über die Technik
 - jedem Server wird einen Wert zugeordnet, basierend auf die Speicherkapazität / Bandwidth /Berechnungspower 
 des entsprechenden Server.
 - Note: The weighted round-robin load balancer is a static load balancer,
  as it does not modify the state of the servers while distributing incoming traffic.

# Algorithmic explanation
1. i: This is the request number that is processed. It is initially set to zero.
2. Weights: This is an array that holds the weights for all the servers.
3. T: This is the total number of servers that are available.

# Algorithm
1. Begin.

2. Assign a specific number of requests to i mod Tth server, according to its numeric weight Weights[i].

3. Increment the value of i by value of 1.

4. Repeat steps 2 and 3, until there are no more requests.

5. End.

# javascript code

```javascript 

function selectServer() {
    let modulo = current_port % MAX_PORT + 1;
    if (modulo == 1) {
        current_port = 3001;
        return current_port;
    } else {
        current_port++;
        return modulo;
    }
}

```


``` 

function selectServer() {
    let modulo = current_port % MAX_PORT + 1;
    if (modulo == 1) {
        current_port = 3001;
        return current_port;
    } else {
        current_port++;
        return modulo;
    }
}

```


# Advantages
This load balancing technique prevents a server from receiving a large number of incoming requests.

It utilizes fewer resources.

The request assignment is deterministic and it is easy to determine the assigned server.

The network administrator can set the numeric weight for the server. This is helpful for when we want some of our server’s resources to be available for other tasks.

# Limitations
The weighted round-robin load balancing technique is not a suitable choice for when we have incoming requests with extensive service time or for when the service time of each request is different.

# Real time load balancers
- Nginx
- Varnish
- HAProxy
- LVS

[klicken Sie hier um die Quelleseite zu öffnen . . .](https://www.educative.io/answers/what-is-the-weighted-round-robin-load-balancing-technique)


[Markdown Tutorial](https://www.youtube.com/watch?v=HUBNt18RFbo&ab_channel=TraversyMedia "Media Traversy")