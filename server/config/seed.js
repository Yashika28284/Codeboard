require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Problem = require("../models/Problem");

dotenv.config({ path: "../../.env" });

const problems = [
    {
        title: "Two Sum", slug: "two-sum", leetcodeNumber: 1, difficulty: "Easy", tags: ["Array", "Hash Map"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" }],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
        starterCode: { javascript: "var twoSum = function(nums, target) {\n  \n};", python: "class Solution:\n    def twoSum(self, nums, target):\n        pass", java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};" },
    },
    {
        title: "Valid Parentheses", slug: "valid-parentheses", leetcodeNumber: 20, difficulty: "Easy", tags: ["String", "Stack"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [{ input: 's = "()"', output: "true" }, { input: 's = "(]"', output: "false" }],
        constraints: ["1 <= s.length <= 10^4"],
        starterCode: { javascript: "var isValid = function(s) {\n  \n};", python: "class Solution:\n    def isValid(self, s):\n        pass", java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};" },
    },
    {
        title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", leetcodeNumber: 121, difficulty: "Easy", tags: ["Array", "Sliding Window"],
        description: "You are given an array prices where prices[i] is the price of a given stock on the i-th day.\n\nReturn the maximum profit you can achieve. If no profit is possible, return 0.",
        examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2, sell on day 5" }],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        starterCode: { javascript: "var maxProfit = function(prices) {\n  \n};", python: "class Solution:\n    def maxProfit(self, prices):\n        pass", java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};" },
    },
    {
        title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", leetcodeNumber: 3, difficulty: "Medium", tags: ["String", "Hash Map", "Sliding Window"],
        description: "Given a string s, find the length of the longest substring without repeating characters.",
        examples: [{ input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3' }],
        constraints: ["0 <= s.length <= 5 * 10^4"],
        starterCode: { javascript: "var lengthOfLongestSubstring = function(s) {\n  \n};", python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        pass", java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};" },
    },
    {
        title: "Maximum Subarray", slug: "maximum-subarray", leetcodeNumber: 53, difficulty: "Medium", tags: ["Array", "Dynamic Programming"],
        description: "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
        examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6" }],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        starterCode: { javascript: "var maxSubArray = function(nums) {\n  \n};", python: "class Solution:\n    def maxSubArray(self, nums):\n        pass", java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};" },
    },
    {
        title: "Climbing Stairs", slug: "climbing-stairs", leetcodeNumber: 70, difficulty: "Easy", tags: ["Dynamic Programming", "Math"],
        description: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [{ input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" }],
        constraints: ["1 <= n <= 45"],
        starterCode: { javascript: "var climbStairs = function(n) {\n  \n};", python: "class Solution:\n    def climbStairs(self, n):\n        pass", java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};" },
    },
    {
        title: "Number of Islands", slug: "number-of-islands", leetcodeNumber: 200, difficulty: "Medium", tags: ["Graph", "Array"],
        description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
        examples: [{ input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2" }],
        constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300"],
        starterCode: { javascript: "var numIslands = function(grid) {\n  \n};", python: "class Solution:\n    def numIslands(self, grid):\n        pass", java: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};" },
    },
    {
        title: "Trapping Rain Water", slug: "trapping-rain-water", leetcodeNumber: 42, difficulty: "Hard", tags: ["Array", "Two Pointers", "Stack"],
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
        constraints: ["n == height.length", "1 <= n <= 2 * 10^4"],
        starterCode: { javascript: "var trap = function(height) {\n  \n};", python: "class Solution:\n    def trap(self, height):\n        pass", java: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}", cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};" },
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        await Problem.deleteMany({});
        await Problem.insertMany(problems);
        console.log(`Seeded ${problems.length} problems`);
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err.message);
        process.exit(1);
    }
};

seed();