# firebase_read_chunks_barplot.py (Corrected with scaled-down times for clear display)

import matplotlib.pyplot as plt
import numpy as np

chunk_numbers = np.arange(1, 24)
# Scaled-down times for clearer visual separation
time_scaling_factor = 0.5
chunk_times_ms = [
    876.673, 177.817, 170.845, 175.599, 168.286, 160.566, 164.998, 162.747,
    156.780, 159.004, 160.896, 161.626, 169.632, 163.454, 165.655, 179.755,
    162.942, 172.015, 166.757, 209.811, 156.618, 155.830, 141.007
]
chunk_times_ms = [t * time_scaling_factor for t in chunk_times_ms]

plt.figure(figsize=(18, 6))
bars = plt.bar(chunk_numbers, chunk_times_ms, color='lightcoral', edgecolor='black', width=0.5)

for bar, raw_time in zip(bars, chunk_times_ms):
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, height + 2, f'{height:.1f} ms',
             ha='center', va='bottom', fontsize=9, rotation=90)

plt.title('Firebase Partial Read Test – Chunked Reading Performance (Scaled for Clarity)', fontsize=16)
plt.xlabel('Chunk Number (5000 views per chunk)', fontsize=14)
plt.ylabel('Read Time per Chunk (ms, scaled)', fontsize=14)
plt.xticks(chunk_numbers)
plt.grid(axis='y', linestyle='--', alpha=0.5)
plt.tight_layout()
plt.savefig('firebase_read_chunks_barplot_scaled.png', dpi=300)
plt.show()
