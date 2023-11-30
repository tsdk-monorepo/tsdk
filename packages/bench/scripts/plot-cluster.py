import matplotlib.pyplot as plt
import numpy as np

# Data
services = ['Express', 'tsdk Express', 'Hono', 'tsdk Hono', 'Trpc Express']
rps = [1901.312, 2413.334, 2077.162, 2420.152, 2233.697]

# Sort the data in ascending order
sorted_indices = np.argsort(rps)
sorted_services = [services[i] for i in sorted_indices]
sorted_rps = [rps[i] for i in sorted_indices]

# Set a specific color for all bars
color = '#3078c6'

# Create a horizontal bar chart
fig, ax = plt.subplots()

bars = ax.barh(sorted_services, sorted_rps, color=color)

# Display numerical labels
for bar in bars:
    xval = bar.get_width()
    plt.text(xval, bar.get_y() + bar.get_height()/2, round(xval, 2), va='center', ha='left', color='white')

# Add labels and title
plt.xlabel('Requests Per Second (RPS)')
plt.title('RPS Comparison Across Services (Ascending Order)')

plt.show()
