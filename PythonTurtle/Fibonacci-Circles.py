from turtle import *
import math

def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [1]
    elif n == 2:
        return [1, 1]

    sequence = [1, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    return sequence

# Setup
speed(0)  # Fastest speed
bgcolor("white")
pensize(2)
scale = 3  # Scale factor to make circles visible

# Generate Fibonacci numbers
fib_numbers = fibonacci(8)

# Draw circles
for i, num in enumerate(fib_numbers):
    # Different colors for each circle
    colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "cyan"]
    color(colors[i % len(colors)])

    # Draw and fill circle
    begin_fill()
    circle(num * scale)
    end_fill()

    # Move to position for next circle
    up()
    forward(num * scale * 2)  # Move forward by diameter
    down()

# Hide turtle and finish
hideturtle()
done()