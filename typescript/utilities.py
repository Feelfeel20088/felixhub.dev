#!/usr/bin/env python3
"""
a small but growing utility libray for helpful classes and utility functions

Usage:
    python3 script.py input_file output_file
"""

import asyncio
import time # for testing
"""[🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 100%"""


import asyncio

class Loading_Bar:
    def __init__(self, sleep: float = 0.5, animation: str = "/|\\|") -> None:
        self.animation = animation
        self.sleep = sleep
        self.running = False
        self._task = None

    async def start(self) -> None:
        """Start the animation."""
        if self.running:
            return  # Prevent multiple tasks from starting
        self.running = True
        print("creating task")
        self._task = asyncio.create_task(self.__animate())

    async def __animate(self) -> None:
        """Run the animation loop."""
        print("animate called")
        try:
            while self.running:
                for frame in self.animation:
                    if not self.running:
                        break
                    print(f"\r\r{frame}", end="", flush=True)
                    await asyncio.sleep(self.sleep)
        except asyncio.CancelledError:
            print("operation was canceled")
            pass  # Allow clean cancellation

    async def stop(self) -> None:
        """Stop the animation. will either stop gracefully or forcfly depending on how much time you set as your sleep"""
        if self.running:
            self.running = False
            if self._task:
                self._task.cancel()
                try:
                    await self._task  # Wait for the task to finish
                except asyncio.CancelledError:
                    pass  # Suppress cancellation exceptions
                self._task = None


from abc import ABC, abstractmethod

class Color(ABC):
    @abstractmethod
    def to_rgb(self):
        pass

    @abstractmethod
    def to_hex(self):
        pass

    
    """ makes your text a certin color """
    def string(string: str, r: int, g: int, b: int) -> str:
        pass


class RGB(Color):
    def string(string: str, r: int, g: int, b: int) -> str:
        return f"\033[48;2;{min(max(r, 0), 255)};{min(max(g, 0), 255)};{min(max(b, 0), 255)}m{string}\033[0m"
        


# Example usage:
async def main() -> None:
    bar = Loading_Bar()
    await bar.start()
    await asyncio.sleep(1)
    print("work going on")
    await asyncio.sleep(1)
    print("work going on")
    await bar.stop()
asyncio.run(main())
