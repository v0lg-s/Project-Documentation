import matplotlib.pyplot as plt
import numpy as np

# Example data for 5 representative batches (to keep it clear for your presentation)
batch_labels = ['Batch 1', 'Batch 50', 'Batch 100', 'Batch 150', 'Batch 200']
batch_times = [1144, 505, 505, 505, 505]  # Replace with your actual times if needed

# Plot
plt.figure(figsize=(8, 5))
bars = plt.bar(batch_labels, batch_times, color='skyblue', edgecolor='black')

# Add data labels on bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height + 10, f'{height} ms',
             ha='center', va='bottom', fontsize=12)

# Titles and labels
plt.title('Firebase Massive Concurrent Writes Test (Bar Chart)')
plt.xlabel('Batch Number')
plt.ylabel('Execution Time (ms)')

# Grid
plt.grid(axis='y', linestyle='--', alpha=0.5)

# Save and show
plt.tight_layout()
plt.savefig('firebase_massive_writes_barplot.png', dpi=300)
plt.show()
